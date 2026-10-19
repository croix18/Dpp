'use strict';
// A fake Apps Script runtime for testing Code.gs offline.
// Models Drive (folders, files, trash), FormApp (quiz items, choices, validation, images),
// SpreadsheetApp (cells with Sheets-style auto-parsing), ScriptApp triggers, LockService,
// PropertiesService, UrlFetchApp against a fake Forms REST API, Utilities.sleep, and the
// 6-minute execution limit (a kill that code cannot catch: every later service call fails).
// Host objects are strict: touching a member the mock does not define throws, so a call to a
// method the real service lacks fails loudly here too.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KIT_DIR = '/home/claude/dpp/script_kit/DPP Forms script kit/DPP Forms kit';
const CODE_PATH = '/home/claude/dpp/script_kit/DPP Forms script kit/Code.gs';
const MANIFEST_TEXT = fs.readFileSync(path.join(KIT_DIR, 'forms_manifest.json'), 'utf8');
const MANIFEST = JSON.parse(MANIFEST_TEXT);
const IMAGE_NAMES = fs.readdirSync(path.join(KIT_DIR, 'images')).sort();

const MIN = 60 * 1000;
const EXEC_LIMIT = 6 * MIN;
const MIME = {
  FOLDER: 'application/vnd.google-apps.folder',
  FORMS: 'application/vnd.google-apps.form',
  SHEETS: 'application/vnd.google-apps.spreadsheet',
  PNG: 'image/png',
  JSON: 'application/json',
};

class Killed extends Error {
  constructor() { super('Exceeded maximum execution time'); this.killed = true; }
}

const PASS = new Set(['then', 'toJSON', 'constructor', 'valueOf', 'toString', 'inspect', 'nodeType', '$$typeof', 'asymmetricMatch']);
function strict(cls, obj) {
  obj.__class = cls;
  return new Proxy(obj, {
    get(t, p) {
      if (p in t) return t[p];
      if (typeof p === 'symbol' || PASS.has(p)) return undefined;
      throw new TypeError(`${cls}.${String(p)} does not exist in the mock (is it a real Apps Script member?)`);
    },
    set(t, p, v) { throw new TypeError(`cannot set ${cls}.${String(p)}`); },
  });
}

// ─────────────────────────── world ───────────────────────────

function makeWorld(opts = {}) {
  const W = {
    T: Date.UTC(2026, 9, 12, 15, 0, 0),
    exec: null, execs: [], execSeq: 0,
    seq: 1, nodes: new Map(),
    triggers: [], trigSeq: 0, maxLiveTriggers: 0,
    lock: null,
    props: {},
    fetches: [],
    apiMode: opts.apiMode || 'ok',
    apiFailEvery: opts.apiFailEvery || 0,
    firedTriggersStay: !!opts.firedTriggersStay,
    hooks: [],
    calls: {},
    config: Object.assign({}, opts.config || {}),
    costs: Object.assign({}, DEFAULT_COSTS, opts.costs || {}),
  };
  newNode(W, { id: 'root', kind: 'folder', mime: MIME.FOLDER, name: 'My Drive', parent: null });
  if (!opts.noKit) addKit(W, opts);
  return W;
}

// rough real-world costs in ms per call
const DEFAULT_COSTS = {
  'FormApp.create': 2000, 'FormApp.openById': 700, 'File.makeCopy': 2500, 'File.moveTo': 800,
  'ImageItem.setImage': 1500, 'File.getBlob': 300, 'add': 400, 'item.set': 150, 'Form.set': 300,
  'UrlFetchApp.fetch': 900, 'Range.setValues': 300, 'Range.getValues': 300, 'Sheet.appendRow': 300,
  'Drive.query': 400, 'Iterator.next': 10, 'trigger': 300, 'default': 50,
};

function cost(W, what) {
  if (what in W.costs) return W.costs[what];
  if (/\.add\w+Item$/.test(what)) return W.costs.add;
  if (/Item\.set\w+$/.test(what)) return W.costs['item.set'];
  if (/^Form\.set/.test(what)) return W.costs['Form.set'];
  if (/getFoldersByName|getFilesByName|getFilesByType|getFiles$/.test(what)) return W.costs['Drive.query'];
  if (/Iterator\.(next|hasNext)/.test(what)) return W.costs['Iterator.next'];
  if (/Trigger|deleteTrigger|getProjectTriggers/.test(what)) return W.costs.trigger;
  return W.costs.default;
}

function tick(W, what, ms) {
  const ex = W.exec;
  if (!ex) throw new Error('service call outside an execution: ' + what);
  if (ex.dead) throw new Killed();
  W.calls[what] = (W.calls[what] || 0) + 1;
  for (const h of W.hooks) h(W, what);
  W.T += ms == null ? cost(W, what) : ms;
  if (W.T - ex.start > EXEC_LIMIT) {
    ex.dead = true;
    ex.killedAt = what;
    throw new Killed();
  }
}

function newNode(W, props) {
  const id = props.id || ('1' + 'x'.repeat(8) + String(W.seq++).padStart(6, '0'));
  const node = Object.assign({ trashed: false, viewers: [], editors: [], parent: 'root' }, props, { id });
  W.nodes.set(id, node);
  return node;
}

function children(W, folder) {
  return [...W.nodes.values()].filter(n => n.parent === folder.id);
}

function addKit(W, opts) {
  const kit = newNode(W, { kind: 'folder', mime: MIME.FOLDER, name: 'DPP Forms kit', parent: 'root' });
  newNode(W, { kind: 'file', mime: MIME.JSON, name: 'forms_manifest.json', parent: kit.id, text: MANIFEST_TEXT });
  const img = newNode(W, { kind: 'folder', mime: MIME.FOLDER, name: 'images', parent: kit.id });
  for (const n of IMAGE_NAMES) newNode(W, { kind: 'file', mime: MIME.PNG, name: n, parent: img.id, diskPath: path.join(KIT_DIR, 'images', n) });
  W.kitId = kit.id;
  W.imagesId = img.id;
}

function findLive(W, pred) { return [...W.nodes.values()].filter(n => !n.trashed && pred(n)); }

// ─────────────────────────── Drive ───────────────────────────

function iter(W, arr, cls) {
  let i = 0;
  return strict(cls, {
    hasNext: () => { tick(W, cls + '.hasNext'); return i < arr.length; },
    next: () => {
      tick(W, cls + '.next');
      if (i >= arr.length) throw new Error('Cannot retrieve the next object: iterator has reached the end.');
      return arr[i++];
    },
  });
}

function UserObj(W, email) {
  return strict('User', { getEmail: () => email });
}

function FolderObj(W, node) {
  const self = strict('Folder', {
    __node: node,
    getId: () => { tick(W, 'Folder.getId', 2); return node.id; },
    getName: () => { tick(W, 'Folder.getName', 2); return node.name; },
    isTrashed: () => { tick(W, 'Folder.isTrashed', 5); return node.trashed; },
    setTrashed: b => { tick(W, 'Folder.setTrashed'); node.trashed = !!b; return self; },
    getFoldersByName: name => { tick(W, 'Folder.getFoldersByName'); return iter(W, children(W, node).filter(n => n.kind === 'folder' && n.name === name).map(n => FolderObj(W, n)), 'FolderIterator'); },
    getFilesByName: name => { tick(W, 'Folder.getFilesByName'); return iter(W, children(W, node).filter(n => n.kind === 'file' && n.name === name).map(n => FileObj(W, n)), 'FileIterator'); },
    getFiles: () => { tick(W, 'Folder.getFiles'); return iter(W, children(W, node).filter(n => n.kind === 'file').map(n => FileObj(W, n)), 'FileIterator'); },
    getFilesByType: mime => {
      tick(W, 'Folder.getFilesByType');
      if (!Object.values(MIME).includes(mime)) throw new Error('Invalid argument: mimeType ' + mime);
      return iter(W, children(W, node).filter(n => n.kind === 'file' && n.mime === mime).map(n => FileObj(W, n)), 'FileIterator');
    },
    createFolder: name => { tick(W, 'Folder.createFolder', 600); return FolderObj(W, newNode(W, { kind: 'folder', mime: MIME.FOLDER, name, parent: node.id })); },
    getViewers: () => { tick(W, 'Folder.getViewers', 300); return node.viewers.map(e => UserObj(W, e)); },
    getEditors: () => { tick(W, 'Folder.getEditors', 300); return node.editors.map(e => UserObj(W, e)); },
    addViewer: email => {
      tick(W, 'Folder.addViewer', 900);
      if (typeof email !== 'string' || !/@/.test(email)) throw new Error('Invalid argument: email');
      node.viewers.push(email);
      return self;
    },
  });
  return self;
}

function BlobObj(W, node) {
  return strict('Blob', {
    __src: node,
    getName: () => node.name,
    getContentType: () => node.mime,
    getDataAsString: charset => {
      if (charset !== undefined && charset !== 'UTF-8') throw new Error('unexpected charset ' + charset);
      if (node.text == null) throw new Error('mock: not a text file');
      return node.text;
    },
    getBytes: () => fs.readFileSync(node.diskPath),
  });
}

function copyForm(W, f) {
  const c = JSON.parse(JSON.stringify(f));
  c.items.forEach(it => { it.apiId = apiId(W); if (it.qid) it.qid = apiId(W); });
  return c;
}

function FileObj(W, node) {
  const self = strict('File', {
    __node: node,
    getId: () => { tick(W, 'File.getId', 2); return node.id; },
    getName: () => { tick(W, 'File.getName', 2); return node.name; },
    getMimeType: () => node.mime,
    isTrashed: () => { tick(W, 'File.isTrashed', 5); return node.trashed; },
    setTrashed: b => { tick(W, 'File.setTrashed'); node.trashed = !!b; return self; },
    getBlob: () => { tick(W, 'File.getBlob'); return BlobObj(W, node); },
    moveTo: dest => {
      tick(W, 'File.moveTo');
      if (!dest || !dest.__node || dest.__node.kind !== 'folder') throw new Error('Invalid argument: destination');
      node.parent = dest.__node.id;
      return self;
    },
    makeCopy: (name, dest) => {
      tick(W, 'File.makeCopy');
      if (typeof name !== 'string' || !dest || !dest.__node) throw new Error('Invalid argument');
      const props = { kind: 'file', mime: node.mime, name, parent: dest.__node.id };
      if (node.form) props.form = copyForm(W, node.form);
      const c = newNode(W, props);
      return FileObj(W, c);
    },
  });
  return self;
}

function DriveAppObj(W) {
  return strict('DriveApp', {
    getFoldersByName: name => {
      tick(W, 'DriveApp.getFoldersByName');
      return iter(W, [...W.nodes.values()].filter(n => n.kind === 'folder' && n.name === name).map(n => FolderObj(W, n)), 'FolderIterator');
    },
    getFileById: id => {
      tick(W, 'DriveApp.getFileById', 300);
      const n = W.nodes.get(String(id));
      if (!n || n.kind !== 'file') throw new Error('No item with the given ID could be found. Possibly because you have not edited this item or you do not have permission to access it.');
      return FileObj(W, n);
    },
  });
}

// ─────────────────────────── Forms ───────────────────────────

let API_SEQ = 0;
function apiId(W) { return (0x1a2b3c4d + (++API_SEQ) * 7919).toString(16).slice(-8); }

function newFormModel(title) {
  return { title, description: '', isQuiz: false, shuffle: false, confirmation: '', collectEmail: false,
    emailType: 'DO_NOT_COLLECT', limitOne: false, items: [], seq: 0, extra: {} };
}

const ITEM_CLASS = { MULTIPLE_CHOICE: 'MultipleChoiceItem', CHECKBOX: 'CheckboxItem', LIST: 'ListItem', TEXT: 'TextItem', IMAGE: 'ImageItem' };

function TypedItem(W, node, it) {
  const F = node.form;
  const cls = ITEM_CLASS[it.kind];
  const o = { __item: it };
  let self;
  o.getId = () => it.id;
  o.getTitle = () => it.title;
  o.getIndex = () => F.items.indexOf(it);
  o.setTitle = t => { tick(W, cls + '.setTitle'); it.title = String(t); return self; };
  if (it.kind !== 'IMAGE') {
    o.setRequired = b => { tick(W, cls + '.setRequired'); if (typeof b !== 'boolean') throw new Error('Invalid argument: enabled'); it.required = b; return self; };
  }
  if (['MULTIPLE_CHOICE', 'CHECKBOX', 'LIST'].includes(it.kind)) {
    o.setChoiceValues = vals => {
      tick(W, cls + '.setChoiceValues');
      if (!Array.isArray(vals) || !vals.length || vals.some(v => typeof v !== 'string' || !v)) throw new Error('Invalid argument: values');
      it.choices = Array.from(vals, v => ({ value: v, isCorrect: false }));
      return self;
    };
    o.createChoice = (value, isCorrect) => {
      if (typeof value !== 'string' || !value) throw new Error('Invalid argument: value');
      if (isCorrect !== undefined && typeof isCorrect !== 'boolean') throw new Error('Invalid argument: isCorrect');
      const c = { value, isCorrect: !!isCorrect, owner: it };
      return strict('Choice', { __choice: c, getValue: () => value, isCorrectAnswer: () => !!isCorrect });
    };
    o.setChoices = choices => {
      tick(W, cls + '.setChoices');
      if (!Array.isArray(choices) || !choices.length) throw new Error('Invalid argument: choices');
      it.choices = Array.from(choices, c => {
        if (!c || !c.__choice) throw new Error('Invalid argument: choices');
        return { value: c.__choice.value, isCorrect: c.__choice.isCorrect };
      });
      if (it.choices.some(c => c.isCorrect) && !F.isQuiz) throw new Error('mock: correct answers set before setIsQuiz(true)');
      return self;
    };
  }
  if (['MULTIPLE_CHOICE', 'CHECKBOX', 'LIST', 'TEXT'].includes(it.kind)) {
    o.setPoints = n => {
      tick(W, cls + '.setPoints');
      if (!Number.isInteger(n) || n < 0) throw new Error('Invalid argument: points');
      if (!F.isQuiz) throw new Error('mock: setPoints before setIsQuiz(true)');
      it.points = n;
      return self;
    };
  }
  if (it.kind === 'TEXT') {
    o.setValidation = v => {
      tick(W, cls + '.setValidation');
      if (!v || !v.__validation) throw new Error('Invalid argument: validation');
      it.validation = Object.assign({}, v.__validation);
      return self;
    };
  }
  if (it.kind === 'IMAGE') {
    o.setImage = blob => {
      tick(W, 'ImageItem.setImage');
      if (!blob || !blob.__src) throw new Error('Invalid argument: image');
      if (blob.__src.mime !== MIME.PNG) throw new Error('mock: image is not a PNG');
      it.image = blob.__src.name;
      return self;
    };
    o.setWidth = w => {
      tick(W, cls + '.setWidth');
      if (!Number.isInteger(w) || w <= 0) throw new Error('Invalid argument: width');
      it.width = w;
      return self;
    };
  }
  self = strict(cls, o);
  return self;
}

function GenericItem(W, node, it) {
  return strict('Item', {
    __item: it,
    getId: () => it.id,
    getTitle: () => it.title,
    getIndex: () => node.form.items.indexOf(it),
    getType: () => it.kind,
  });
}

function FormObj(W, node) {
  const F = node.form;
  const add = kind => {
    tick(W, 'Form.add' + ITEM_CLASS[kind]);
    const it = { id: ++F.seq + 100000, apiId: apiId(W), qid: kind === 'IMAGE' ? null : apiId(W), kind, title: '',
      required: false, points: 0, choices: [], validation: null, image: null, width: null, keys: null };
    F.items.push(it);
    return TypedItem(W, node, it);
  };
  const flag = (name, key, type = 'boolean') => v => {
    tick(W, 'Form.' + name);
    if (typeof v !== type) throw new Error(`Invalid argument for ${name}: ${v}`);
    F[key] = v;
    return self;
  };
  const o = {
    __node: node,
    getId: () => { tick(W, 'Form.getId', 2); return node.id; },
    getTitle: () => { tick(W, 'Form.getTitle'); return F.title; },
    setTitle: flag('setTitle', 'title', 'string'),
    setDescription: flag('setDescription', 'description', 'string'),
    setIsQuiz: flag('setIsQuiz', 'isQuiz'),
    isQuiz: () => { tick(W, 'Form.isQuiz'); return F.isQuiz; },
    setShuffleQuestions: flag('setShuffleQuestions', 'shuffle'),
    setConfirmationMessage: flag('setConfirmationMessage', 'confirmation', 'string'),
    setLimitOneResponsePerUser: flag('setLimitOneResponsePerUser', 'limitOne'),
    getEditUrl: () => { tick(W, 'Form.getEditUrl', 20); return `https://docs.google.com/forms/d/${node.id}/edit`; },
    getItems: () => { tick(W, 'Form.getItems'); return F.items.map(it => GenericItem(W, node, it)); },
    deleteItem: x => {
      tick(W, 'Form.deleteItem');
      const idx = typeof x === 'number' ? x : F.items.indexOf(x && x.__item);
      if (!(idx >= 0 && idx < F.items.length)) throw new Error('Invalid argument: item');
      F.items.splice(idx, 1);
    },
    addMultipleChoiceItem: () => add('MULTIPLE_CHOICE'),
    addCheckboxItem: () => add('CHECKBOX'),
    addListItem: () => add('LIST'),
    addTextItem: () => add('TEXT'),
    addImageItem: () => add('IMAGE'),
  };
  // Real FormApp has no setEmailCollectionType; setCollectEmail(true) turns collection on, type unknown.
  o.setCollectEmail = v => {
    tick(W, 'Form.setCollectEmail');
    if (typeof v !== 'boolean') throw new Error('Invalid argument: collect');
    F.collectEmail = v;
    F.emailType = v ? (F.emailType === 'DO_NOT_COLLECT' ? 'FORMAPP_ON' : F.emailType) : 'DO_NOT_COLLECT';
    return self;
  };
  const self = strict('Form', o);
  return self;
}

function FormAppObj(W) {
  return strict('FormApp', {
    create: title => {
      tick(W, 'FormApp.create');
      if (typeof title !== 'string' || !title) throw new Error('Invalid argument: title');
      return FormObj(W, newNode(W, { kind: 'file', mime: MIME.FORMS, name: title, parent: 'root', form: newFormModel(title) }));
    },
    openById: id => {
      tick(W, 'FormApp.openById');
      const n = W.nodes.get(String(id));
      if (!n || !n.form) throw new Error('No item with the given ID could be found, or you do not have permission to access it.');
      return FormObj(W, n);
    },
    createTextValidation: () => {
      const v = {};
      const b = strict('TextValidationBuilder', {
        setHelpText: t => { v.help = String(t); return b; },
        requireTextMatchesPattern: p => { new RegExp(p); v.kind = 'MATCHES'; v.pattern = String(p); return b; },
        build: () => strict('TextValidation', { __validation: Object.assign({}, v) }),
      });
      return b;
    },
  });
}

// ─────────────────────────── Sheets ───────────────────────────
// Cells parse like typed input: '12' -> 12, '2/7' -> a date, '4 1/3' -> 4.333…, a leading ' keeps text.

function parseCell(v) {
  if (typeof v !== 'string') return v;
  if (v.startsWith("'")) return { text: v.slice(1) };
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(v)) return Number(v);
  if (/^\d{1,2}\/\d{1,2}(\/\d{2,4})?$/.test(v)) return { date: v };
  if (/^-?\d+ \d+\/\d+$/.test(v)) { const [w, f] = v.replace('-', '').split(' '); const [a, b] = f.split('/'); return (v.startsWith('-') ? -1 : 1) * (+w + a / b); }
  return v;
}
function shown(c) {
  if (c == null) return '';
  if (typeof c === 'object' && 'text' in c) return c.text;
  if (typeof c === 'object' && 'date' in c) return new Date('2026/' + c.date.split('/').slice(0, 2).join('/'));
  return c;
}
function lastRow(sh) { for (let r = sh.rows.length; r >= 1; r--) if ((sh.rows[r - 1] || []).some(c => c !== undefined && c !== '')) return r; return 0; }
function lastCol(sh) { let m = 0; sh.rows.forEach(row => (row || []).forEach((c, j) => { if (c !== undefined && c !== '') m = Math.max(m, j + 1); })); return m; }
function setCell(sh, r, c, v) { while (sh.rows.length < r) sh.rows.push([]); sh.rows[r - 1][c - 1] = parseCell(v); }
function getCell(sh, r, c) { const v = (sh.rows[r - 1] || [])[c - 1]; return v === undefined ? '' : shown(v); }

function RangeObj(W, sh, r, c, nr, nc) {
  const self = strict('Range', {
    setValues: vals => {
      tick(W, 'Range.setValues');
      if (!Array.isArray(vals) || vals.length !== nr) throw new Error(`The number of rows in the data does not match the number of rows in the range. The data has ${vals.length} but the range has ${nr}.`);
      vals.forEach((row, i) => {
        if (row.length !== nc) throw new Error(`The number of columns in the data does not match the number of columns in the range. The data has ${row.length} but the range has ${nc}.`);
        row.forEach((v, j) => setCell(sh, r + i, c + j, v));
      });
      return self;
    },
    getValue: () => { tick(W, 'Range.getValue'); return getCell(sh, r, c); },
    setValue: v => { tick(W, 'Range.setValue'); if (nr !== 1 || nc !== 1) throw new Error('mock: setValue on a multi-cell range'); setCell(sh, r, c, v); return self; },
    getValues: () => {
      tick(W, 'Range.getValues');
      const out = [];
      for (let i = 0; i < nr; i++) { const row = []; for (let j = 0; j < nc; j++) row.push(getCell(sh, r + i, c + j)); out.push(row); }
      return out;
    },
    setFontWeight: w => { tick(W, 'Range.setFontWeight'); sh.bold.push([r, c, nr, nc, w]); return self; },
    sort: spec => {
      tick(W, 'Range.sort');
      const col = typeof spec === 'number' ? spec : spec.column;
      const asc = !(spec && typeof spec === 'object' && spec.ascending === false);
      if (!(col >= c && col < c + nc)) throw new Error('mock: sort column outside the range');
      const block = [];
      for (let i = 0; i < nr; i++) { const row = []; for (let j = 0; j < nc; j++) row.push((sh.rows[r + i - 1] || [])[c + j - 1]); block.push(row); }
      block.sort((a, b) => { const x = a[col - c], y = b[col - c]; return (x < y ? -1 : x > y ? 1 : 0) * (asc ? 1 : -1); });
      block.forEach((row, i) => row.forEach((v, j) => { while (sh.rows.length < r + i) sh.rows.push([]); sh.rows[r + i - 1][c + j - 1] = v; }));
      return self;
    },
  });
  return self;
}

function SheetObj(W, ssNode, sh) {
  const self = strict('Sheet', {
    __sheet: sh,
    getName: () => sh.name,
    setName: n => { tick(W, 'Sheet.setName'); sh.name = n; return self; },
    getRange: (r, c, nr = 1, nc = 1) => {
      tick(W, 'Sheet.getRange', 20);
      if (![r, c, nr, nc].every(x => Number.isInteger(x) && x >= 1)) throw new Error(`mock: bad range ${r},${c},${nr},${nc}`);
      return RangeObj(W, sh, r, c, nr, nc);
    },
    getDataRange: () => { tick(W, 'Sheet.getDataRange', 20); return RangeObj(W, sh, 1, 1, Math.max(lastRow(sh), 1), Math.max(lastCol(sh), 1)); },
    appendRow: vals => { tick(W, 'Sheet.appendRow'); const r = lastRow(sh) + 1; vals.forEach((v, j) => setCell(sh, r, j + 1, v)); return self; },
    getLastRow: () => { tick(W, 'Sheet.getLastRow', 20); return lastRow(sh); },
    setFrozenRows: n => { tick(W, 'Sheet.setFrozenRows'); sh.frozen = n; return self; },
    setColumnWidth: (col, w) => { tick(W, 'Sheet.setColumnWidth'); sh.widths[col] = w; return self; },
    deleteRow: r => { tick(W, 'Sheet.deleteRow'); if (!(r >= 1 && r <= lastRow(sh))) throw new Error('mock: deleteRow out of range'); sh.rows.splice(r - 1, 1); return self; },
  });
  return self;
}

function newSheet(name) { return { name, rows: [], frozen: 0, widths: {}, bold: [] }; }

function SSObj(W, node) {
  return strict('Spreadsheet', {
    getId: () => node.id,
    getSheets: () => { tick(W, 'Spreadsheet.getSheets', 30); return node.ss.sheets.map(sh => SheetObj(W, node, sh)); },
    getSheetByName: name => { tick(W, 'Spreadsheet.getSheetByName', 30); const sh = node.ss.sheets.find(s => s.name === name); return sh ? SheetObj(W, node, sh) : null; },
    insertSheet: name => {
      tick(W, 'Spreadsheet.insertSheet', 500);
      if (node.ss.sheets.some(s => s.name === name)) throw new Error(`A sheet with the name "${name}" already exists. Please enter another name.`);
      const sh = newSheet(name);
      node.ss.sheets.unshift(sh);
      return SheetObj(W, node, sh);
    },
  });
}

function SpreadsheetAppObj(W) {
  return strict('SpreadsheetApp', {
    create: name => { tick(W, 'SpreadsheetApp.create', 1500); return SSObj(W, newNode(W, { kind: 'file', mime: MIME.SHEETS, name, parent: 'root', ss: { sheets: [newSheet('Sheet1')] } })); },
    openById: id => {
      tick(W, 'SpreadsheetApp.openById', 800);
      const n = W.nodes.get(String(id));
      if (!n || !n.ss) throw new Error('mock: no spreadsheet ' + id);
      return SSObj(W, n);
    },
  });
}

// ─────────────────────────── triggers, lock, properties ───────────────────────────

function liveTriggers(W) { return W.triggers.filter(t => !t.deleted && !t.fired); }

function TriggerObj(W, t) {
  return strict('Trigger', { __t: t, getHandlerFunction: () => t.fn, getUniqueId: () => t.id });
}

function ScriptAppObj(W) {
  return strict('ScriptApp', {
    newTrigger: fn => {
      tick(W, 'ScriptApp.newTrigger', 20);
      const spec = { fn };
      const tb = strict('TriggerBuilder', {
        timeBased: () => {
          const cb = strict('ClockTriggerBuilder', {
            after: ms => { if (!Number.isInteger(ms) || ms < 0) throw new Error('Invalid argument: durationMilliseconds'); spec.after = ms; return cb; },
            create: () => {
              tick(W, 'ClockTriggerBuilder.create');
              if (spec.after == null) throw new Error('mock: time-based trigger with no time');
              if (W.triggers.filter(t => !t.deleted).length >= 20) throw new Error('This script has too many triggers. Triggers must be deleted from the script before more can be added.');
              const t = { id: 'trig' + (++W.trigSeq), fn: spec.fn, at: W.T + spec.after, fired: false, deleted: false, createdBy: W.exec.id };
              W.triggers.push(t);
              W.maxLiveTriggers = Math.max(W.maxLiveTriggers, liveTriggers(W).length);
              return TriggerObj(W, t);
            },
          });
          return cb;
        },
      });
      return tb;
    },
    getProjectTriggers: () => { tick(W, 'ScriptApp.getProjectTriggers'); return W.triggers.filter(t => !t.deleted).map(t => TriggerObj(W, t)); },
    deleteTrigger: tr => {
      tick(W, 'ScriptApp.deleteTrigger');
      const t = tr && tr.__t;
      if (!t || t.deleted) throw new Error('mock: deleting a trigger that does not exist');
      t.deleted = true;
    },
    getOAuthToken: () => 'ya29.mock-token',
  });
}

function LockServiceObj(W) {
  return strict('LockService', {
    getScriptLock: () => strict('Lock', {
      tryLock: ms => {
        tick(W, 'Lock.tryLock', 5);
        const me = W.exec.id;
        if (!W.lock || W.lock.owner === me) { W.lock = { owner: me }; return true; }
        if (W.lock.releaseAt != null && W.lock.releaseAt <= W.T + ms) { W.T = Math.max(W.T, W.lock.releaseAt); W.lock = { owner: me }; return true; }
        W.T += ms;
        return false;
      },
      releaseLock: () => { tick(W, 'Lock.releaseLock', 5); if (W.lock && W.lock.owner === W.exec.id) W.lock = null; },
    }),
  });
}

function PropertiesServiceObj(W) {
  const props = strict('Properties', {
    getProperty: k => { tick(W, 'Properties.getProperty', 10); return k in W.props ? W.props[k] : null; },
    setProperty: (k, v) => { tick(W, 'Properties.setProperty', 10); W.props[k] = String(v); return props; },
    deleteProperty: k => { tick(W, 'Properties.deleteProperty', 10); delete W.props[k]; return props; },
  });
  return strict('PropertiesService', { getScriptProperties: () => props });
}

// ─────────────────────────── Forms REST API ───────────────────────────

function apiItem(F, it) {
  const out = { itemId: it.apiId };
  if (it.title) out.title = it.title;
  if (it.kind === 'IMAGE') {
    out.imageItem = { image: { contentUri: 'https://lh7-rt.googleusercontent.com/formsz/' + it.apiId, properties: { alignment: 'LEFT', width: it.width || 0 } } };
    return out;
  }
  const q = { questionId: it.qid };
  if (it.required) q.required = true;
  if (it.kind === 'TEXT') q.textQuestion = {};
  else q.choiceQuestion = { type: { MULTIPLE_CHOICE: 'RADIO', CHECKBOX: 'CHECKBOX', LIST: 'DROP_DOWN' }[it.kind], options: it.choices.map(c => ({ value: c.value })) };
  if (F.isQuiz) {
    const g = {};
    if (it.points) g.pointValue = it.points;
    const correct = it.kind === 'TEXT' ? (it.keys || []) : it.choices.filter(c => c.isCorrect).map(c => c.value);
    if (correct.length) g.correctAnswers = { answers: correct.map(v => ({ value: v })) };
    if (Object.keys(g).length) q.grading = g;
  }
  out.questionItem = { question: q };
  return out;
}

const API_EMAIL = { DO_NOT_COLLECT: 'DO_NOT_COLLECT', VERIFIED: 'VERIFIED', RESPONDER_INPUT: 'RESPONDER_INPUT', FORMAPP_ON: 'RESPONDER_INPUT' };
function revision(F) {
  const t = JSON.stringify(F);
  let h = 0;
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
  return 'rev' + (h >>> 0).toString(16);
}
function apiForm(node) {
  const F = node.form;
  return { formId: node.id, info: { title: F.title, documentTitle: node.name },
    settings: { quizSettings: { isQuiz: F.isQuiz }, emailCollectionType: API_EMAIL[F.emailType] },
    items: F.items.map(it => apiItem(F, it)), revisionId: revision(F), responderUri: 'https://docs.google.com/forms/d/e/x/viewform' };
}

function response(code, body) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return strict('HTTPResponse', { getResponseCode: () => code, getContentText: () => text });
}

function apiError(code, message, status, extra) {
  return response(code, { error: Object.assign({ code, message, status }, extra || {}) });
}

function formsApi(W, url, options) {
  const base = 'https://forms.googleapis.com/v1/forms/';
  if (!url.startsWith(base)) throw new Error('mock: unexpected URL ' + url);
  if (!options || options.muteHttpExceptions !== true) throw new Error('mock: muteHttpExceptions should be true');
  if (!options.headers || options.headers.Authorization !== 'Bearer ya29.mock-token') return apiError(401, 'Request is missing required authentication credential.', 'UNAUTHENTICATED');
  const rest = url.slice(base.length);
  const isBatch = rest.endsWith(':batchUpdate');
  const id = isBatch ? rest.slice(0, -':batchUpdate'.length) : rest;
  const method = String(options.method || 'get').toLowerCase();
  W.fetches.push({ id, kind: isBatch ? 'batchUpdate' : 'get', method, payload: options.payload });
  if (W.apiMode === 'disabled') {
    return apiError(403, 'Google Forms API has not been used in project 123456789 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/forms.googleapis.com/overview?project=123456789 then retry.', 'PERMISSION_DENIED',
      { details: [{ '@type': 'type.googleapis.com/google.rpc.ErrorInfo', reason: 'SERVICE_DISABLED' }] });
  }
  if (W.apiMode === 'unauthorized') return apiError(403, 'Request had insufficient authentication scopes.', 'PERMISSION_DENIED');
  if (W.apiFailEvery && W.fetches.length % W.apiFailEvery === 0) return apiError(503, 'The service is currently unavailable.', 'UNAVAILABLE');
  const node = W.nodes.get(id);
  if (!node || !node.form) return apiError(404, 'Requested entity was not found.', 'NOT_FOUND');
  const F = node.form;
  if (!isBatch) {
    if (method !== 'get') throw new Error('mock: GET expected');
    return response(200, apiForm(node));
  }
  if (method !== 'post') throw new Error('mock: batchUpdate must be POST');
  if (options.contentType !== 'application/json') throw new Error('mock: batchUpdate needs contentType application/json');
  let body;
  try { body = JSON.parse(options.payload); } catch (e) { return apiError(400, 'Invalid JSON payload received.', 'INVALID_ARGUMENT'); }
  const bad = m => apiError(400, m, 'INVALID_ARGUMENT');
  if (Object.keys(body).some(k => !['requests', 'includeFormInResponse', 'writeControl'].includes(k))) return bad('Unknown name in batchUpdate body');
  if (!Array.isArray(body.requests) || !body.requests.length) return bad('requests is empty');
  if (body.writeControl) {
    const keys = Object.keys(body.writeControl);
    if (keys.length !== 1 || keys[0] !== 'requiredRevisionId') return bad('unexpected writeControl');
    if (body.writeControl.requiredRevisionId !== revision(F)) return bad('The revision ID is not the latest revision of the form.');
  } else {
    W.noWriteControl = (W.noWriteControl || 0) + 1;
  }
  const pending = [];
  const settings = [];
  for (const r of body.requests) {
    if (Object.keys(r).length !== 1) return bad('one request per entry');
    if (r.updateSettings) {
      const u = r.updateSettings;
      if (Object.keys(u).some(k => !['settings', 'updateMask'].includes(k))) return bad('Unknown name in updateSettings');
      if (u.updateMask !== 'emailCollectionType') return bad('unexpected settings mask ' + u.updateMask);
      if (W.refuseEmail) return bad('Email collection type VERIFIED is not supported for this form.');
      if (!u.settings || Object.keys(u.settings).length !== 1 || !['DO_NOT_COLLECT', 'VERIFIED', 'RESPONDER_INPUT'].includes(u.settings.emailCollectionType)) return bad('bad settings');
      settings.push(u.settings.emailCollectionType);
      continue;
    }
    if (!r.updateItem) return bad('mock expects updateItem or updateSettings requests');
    const u = r.updateItem;
    if (Object.keys(u).some(k => !['item', 'location', 'updateMask'].includes(k))) return bad('Unknown name in updateItem');
    const idx = u.location && u.location.index;
    if (!Number.isInteger(idx) || idx < 0 || idx >= F.items.length) return bad('location.index out of range');
    if (u.updateMask !== 'questionItem.question.grading') return bad('unexpected updateMask ' + u.updateMask);
    const it = F.items[idx];
    if (u.item.itemId !== undefined && u.item.itemId !== it.apiId) return bad('item id does not match the item at that index');
    const q = u.item.questionItem && u.item.questionItem.question;
    if (!q) return bad('questionItem.question missing');
    if (q.questionId !== undefined && q.questionId !== it.qid) return bad('question id does not match');
    if (it.kind !== 'TEXT') return bad('mock: grading update on a non-text question');
    const g = q.grading;
    if (!g || Object.keys(g).some(k => !['pointValue', 'correctAnswers', 'whenRight', 'whenWrong', 'generalFeedback'].includes(k))) return bad('bad grading');
    if (!Number.isInteger(g.pointValue) || g.pointValue < 0) return bad('pointValue must be a non-negative integer');
    const a = g.correctAnswers && g.correctAnswers.answers;
    if (!Array.isArray(a) || !a.length || a.some(x => Object.keys(x).length !== 1 || typeof x.value !== 'string' || !x.value)) return bad('bad correctAnswers');
    if (!F.isQuiz) return bad('grading on a form that is not a quiz');
    pending.push({ it, points: g.pointValue, keys: a.map(x => x.value) });
  }
  pending.forEach(p => { p.it.points = p.points; p.it.keys = p.keys; });
  settings.forEach(t => { F.emailType = t; F.collectEmail = t !== 'DO_NOT_COLLECT'; });
  return response(200, { replies: body.requests.map(() => ({})), writeControl: { requiredRevisionId: 'x' } });
}

function UrlFetchAppObj(W) {
  return strict('UrlFetchApp', { fetch: (url, options) => { tick(W, 'UrlFetchApp.fetch'); return formsApi(W, url, options); } });
}

// ─────────────────────────── runtime ───────────────────────────

const CODE = () => fs.readFileSync(CODE_PATH, 'utf8');

function context(W) {
  class FakeDate extends Date {
    constructor(...a) { super(...(a.length ? a : [W.T])); }
    static now() { return W.T; }
  }
  const out = level => (...a) => { tick(W, 'console.' + level, 0); W.exec.logs.push(`${level}: ${a.join(' ')}`); };
  const ctx = {
    DriveApp: DriveAppObj(W), FormApp: FormAppObj(W), SpreadsheetApp: SpreadsheetAppObj(W), ScriptApp: ScriptAppObj(W),
    UrlFetchApp: UrlFetchAppObj(W), LockService: LockServiceObj(W), PropertiesService: PropertiesServiceObj(W),
    Utilities: strict('Utilities', { sleep: ms => tick(W, 'Utilities.sleep', ms) }),
    MimeType: strict('MimeType', { GOOGLE_FORMS: MIME.FORMS, GOOGLE_SHEETS: MIME.SHEETS, FOLDER: MIME.FOLDER, PNG: MIME.PNG }),
    console: { log: out('log'), info: out('info'), warn: out('warn'), error: out('error') },
    Date: FakeDate,
  };
  vm.createContext(ctx);
  vm.runInContext(CODE(), ctx, { filename: 'Code.gs' });
  for (const [k, v] of Object.entries(W.config)) vm.runInContext(`CONFIG[${JSON.stringify(k)}] = ${JSON.stringify(v)};`, ctx);
  return ctx;
}

// One execution: fresh globals (as in Apps Script), the 6-minute kill, and the lock released at the end.
function run(W, fn, trigger) {
  const ex = { id: ++W.execSeq, fn, start: W.T, dead: false, logs: [], trigger: trigger ? trigger.id : null };
  W.execs.push(ex);
  W.exec = ex;
  const ctx = context(W);
  try {
    ctx[fn]();
  } catch (e) {
    if (e && e.killed) ex.killed = true;
    else ex.error = e;
  }
  if (W.lock && W.lock.owner === ex.id) W.lock = null;
  ex.end = W.T;
  W.exec = null;
  return ex;
}

// Fire pending triggers in time order until none is left.
function drain(W, max = 300) {
  let n = 0;
  for (;;) {
    const next = liveTriggers(W).sort((a, b) => a.at - b.at)[0];
    if (!next) return n;
    W.T = Math.max(W.T, next.at);
    next.fired = true;
    if (!W.firedTriggersStay) next.deleted = true;
    run(W, next.fn, next);
    if (++n > max) throw new Error('runaway triggers');
  }
}

module.exports = { makeWorld, run, drain, MANIFEST, IMAGE_NAMES, MIME, MIN, findLive, children, liveTriggers, shown };
