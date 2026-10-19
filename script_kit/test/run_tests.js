'use strict';
// Runs Code.gs against the mock Apps Script runtime and checks every built form against the manifest.
const assert = require('assert');
const M = require('./mock_gas.js');
const { makeWorld, run, drain, MANIFEST, MIME, MIN, findLive, liveTriggers } = M;

const TEACHERS = ['Mr. C. Shaffer', 'Mr. J. Shaffer'];
const PERIODS = ['1', '2', '3', '4', '5', '6', '7'];
const LEVELS = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];
const STOP_KEY = 'DPP_STOP_BUILD';
let passed = 0;
const results = [];

function test(name, fn) {
  try {
    const note = fn();
    passed++;
    results.push(`PASS  ${name}${note ? '  (' + note + ')' : ''}`);
  } catch (e) {
    results.push(`FAIL  ${name}\n      ${e.stack.split('\n').slice(0, 4).join('\n      ')}`);
  }
}

function sheetRows(sh) {
  const out = [];
  const lr = sh.rows.length;
  for (let r = 1; r <= lr; r++) {
    const row = (sh.rows[r - 1] || []).map(M.shown);
    if (row.some(c => c !== '' && c !== undefined)) out.push(row);
  }
  return out;
}

function outFolder(W) {
  const outs = findLive(W, n => n.kind === 'folder' && n.parent === W.kitId && n.name === 'DPP Forms (built)');
  assert.strictEqual(outs.length, 1, 'exactly one live output folder');
  return outs[0];
}

function linksSheet(W) {
  const out = outFolder(W);
  const logs = findLive(W, n => n.parent === out.id && n.name === 'DPP Forms links');
  assert.strictEqual(logs.length, 1, 'exactly one live links sheet in the output folder');
  return logs[0].ss;
}

function logRows(W) {
  const ss = linksSheet(W);
  const rows = sheetRows(ss.sheets.find(x => x.name === 'Forms'));
  const head = rows.shift();
  return { ss, head, rows: rows.map(r => ({ order: r[0], key: r[1], title: r[2], n: r[3], calc: r[4], locked: r[5], keys: r[6], status: r[7], edit: r[8], copy: r[9], id: r[10] })) };
}

function expectChoiceItem(it, kind, title, values, correct, points) {
  assert.strictEqual(it.kind, kind, `${title}: kind`);
  assert.strictEqual(it.title, title);
  assert.strictEqual(it.required, true, `${title}: required`);
  assert.deepStrictEqual(it.choices.map(c => c.value), values, `${title}: choices`);
  assert.deepStrictEqual(it.choices.filter(c => c.isCorrect).map(c => c.value), correct, `${title}: correct choices`);
  assert.strictEqual(it.points, points, `${title}: points`);
}

/** Every form in `forms` exists once, live, in the output folder, and matches the manifest item by item. */
function verifyBuild(W, { only = '', typed = 'set', template = false, schoolEmail = '', extraForms = 0 } = {}) {
  const forms = MANIFEST.forms.filter(f => !only || f.id === only || f.key === only);
  const out = outFolder(W);
  const { ss, head, rows } = logRows(W);
  assert.strictEqual(head.length, 11);
  assert.strictEqual(head[1], 'Form');
  assert(ss.sheets.some(x => x.name === 'Forms'));
  const orders = rows.map(r => r.order);
  assert.deepStrictEqual(orders, [...orders].sort((a, b) => a - b), 'links sheet sorted by Order');
  const byKey = {};
  rows.forEach(r => { assert(!byKey[r.key], 'duplicate row ' + r.key); byKey[r.key] = r; });
  const live = findLive(W, n => n.parent === out.id && n.mime === MIME.FORMS);
  assert.strictEqual(live.length, forms.length + extraForms, `live forms in the output folder: ${live.length}`);
  let typedRows = 0;
  for (const F of forms) {
    const row = byKey[F.key];
    assert(row, 'row for ' + F.key);
    assert.strictEqual(row.status, 'built', F.key + ' status');
    const node = W.nodes.get(row.id);
    assert(node && node.form && !node.trashed && node.parent === out.id, F.key + ': form is live in the output folder');
    const f = node.form;
    assert.strictEqual(f.title, F.title);
    assert.strictEqual(node.name, F.title);
    assert.strictEqual(f.description, F.description);
    assert.strictEqual(f.isQuiz, true);
    assert.strictEqual(f.shuffle, false);
    assert(/progress strip/.test(f.confirmation));
    if (template) assert.strictEqual(f.extra.fromTemplate, true, 'template settings carried over');
    const apiOn = W.config.USE_FORMS_API !== false && W.apiMode === 'ok';
    assert.strictEqual(f.emailType, apiOn || template ? 'VERIFIED' : 'FORMAPP_ON', F.key + ' email collection');
    assert.strictEqual(f.collectEmail, true);
    assert.strictEqual(f.limitOne, true);
    const items = f.items;
    let i = 0;
    expectChoiceItem(items[i++], 'MULTIPLE_CHOICE', 'Teacher', TEACHERS, [], 0);
    expectChoiceItem(items[i++], 'LIST', 'Period', PERIODS, [], 0);
    let hasTyped = false;
    for (const Q of F.questions) {
      const img = items[i++];
      assert.strictEqual(img.kind, 'IMAGE', `${F.key} Q${Q.n}: image first`);
      assert.strictEqual(img.image, Q.image);
      assert.strictEqual(img.width, 640);
      const it = items[i++];
      const title = 'Question ' + Q.n;
      if (Q.type === 'sa') {
        hasTyped = true;
        assert.strictEqual(it.kind, 'TEXT');
        assert.strictEqual(it.title, title);
        assert.strictEqual(it.required, true);
        assert.strictEqual(it.points, 1);
        assert.deepStrictEqual(it.validation, { help: MANIFEST.regex_error, kind: 'MATCHES', pattern: MANIFEST.regex });
        if (typed === 'set') assert.deepStrictEqual(it.keys, Q.accept, `${F.key} Q${Q.n}: typed key`);
        else assert.strictEqual(it.keys, null);
      } else {
        expectChoiceItem(it, Q.type === 'mc' ? 'MULTIPLE_CHOICE' : 'CHECKBOX', title, Q.options, Q.options.filter(o => Q.correct.includes(o)), 1);
      }
    }
    if (F.level_image) {
      const img = items[i++];
      assert.strictEqual(img.kind, 'IMAGE');
      assert.strictEqual(img.image, F.level_image);
      expectChoiceItem(items[i++], 'MULTIPLE_CHOICE', 'Look at the scale above. Which level are you at right now?', LEVELS, [], 0);
    }
    assert.strictEqual(i, items.length, F.key + ': no extra items');
    assert.strictEqual(row.keys, hasTyped ? (typed === 'set' ? 'set' : 'add by hand') : 'none', F.key + ' keys column');
    assert.strictEqual(row.edit, `https://docs.google.com/forms/d/${row.id}/edit`);
    assert.strictEqual(row.copy, `https://docs.google.com/forms/d/${row.id}/copy` + (schoolEmail ? '?authuser=' + encodeURIComponent(schoolEmail) : ''));
    assert.strictEqual(row.calc, F.calc === 'yes' ? 'allowed' : 'no');
    assert.strictEqual(row.locked, F.calc === 'no' ? 'on' : 'off');
    assert.strictEqual(row.n, F.questions.length);
    assert.strictEqual(row.title, F.title);
    if (hasTyped && typed !== 'set') typedRows += F.questions.filter(q => q.type === 'sa').length;
  }
  const tab = ss.sheets.find(s => s.name === 'Typed keys to add');
  if (typed === 'set') {
    assert(!tab || sheetRows(tab).length <= 1, 'no typed-key rows when the API set them');
  } else {
    const trows = tab ? sheetRows(tab).slice(1) : [];
    assert.strictEqual(trows.length, typedRows, 'one typed-tab row per typed question');
    for (const r of trows) {
      const F = forms.find(f => f.key === r[0]);
      const Q = F.questions.find(q => 'Question ' + q.n === r[1]);
      assert.strictEqual(r[2], byKey[F.key].edit);
      const shownAnswers = r.slice(3).filter(x => x !== '' && x !== undefined);
      assert.deepStrictEqual(shownAnswers, Q.accept, `${F.key} ${r[1]}: typed tab shows the answers exactly as text`);
    }
  }
  return `${forms.length} forms, ${forms.reduce((s, f) => s + f.questions.length, 0)} questions checked`;
}

function logsOf(W) { return W.execs.flatMap(e => e.logs); }
function lastLogs(W) { return W.execs[W.execs.length - 1].logs.join('\n'); }
function errorsOf(W) { return W.execs.filter(e => e.error).map(e => `${e.fn}: ${e.error.message}`); }
function minutes(ms) { return (ms / MIN).toFixed(1); }

// ───────────────────────────── data checks ─────────────────────────────

test('every accepted typed answer passes the typing rule; common wrong formats do not', () => {
  const re = new RegExp(MANIFEST.regex);
  const all = MANIFEST.forms.flatMap(f => f.questions.filter(q => q.type === 'sa').flatMap(q => q.accept));
  const failing = all.filter(a => !re.test(a));
  assert.deepStrictEqual(failing, []);
  for (const bad of ['12 cm', '$5', '50%', '7π', '1,200', '', ' 12', '4  1/3', 'x = 5', '3.', '--2']) assert(!re.test(bad), 'rule should reject ' + JSON.stringify(bad));
  for (const good of ['12', '-3.5', '2/7', '4 1/3', '.5', '0.50', '-1 1/2', '700/11']) assert(re.test(good), 'rule should accept ' + good);
  return `${all.length} accepted answers`;
});

test('manifest: choice lists hold their keys, image names unique, 102 forms', () => {
  assert.strictEqual(MANIFEST.forms.length, 102);
  const names = new Set();
  for (const f of MANIFEST.forms) for (const q of f.questions) {
    assert(!names.has(q.image)); names.add(q.image);
    assert(M.IMAGE_NAMES.includes(q.image), q.image);
    if (q.type !== 'sa') {
      assert(q.correct.length >= 1 && q.correct.every(c => q.options.includes(c)));
      assert(q.options.every(o => o === o.trim() && o.length > 0), 'choice text trimmed');
    }
  }
  return `${names.size} question images`;
});

// ───────────────────────────── testSetup ─────────────────────────────

test('testSetup with no kit in Drive says to upload it', () => {
  const W = makeWorld({ noKit: true });
  run(W, 'testSetup');
  assert.deepStrictEqual(errorsOf(W), []);
  assert(/FIX   There is no folder named "DPP Forms kit"/.test(lastLogs(W)), lastLogs(W));
});

test('testSetup on a good setup: all OK, temp form trashed, nothing else made', () => {
  const W = makeWorld();
  const before = W.nodes.size;
  run(W, 'testSetup');
  const out = lastLogs(W);
  assert.deepStrictEqual(errorsOf(W), []);
  assert(/OK    Found "DPP Forms kit" with 102 forms/.test(out), out);
  assert(/OK    All 374 images are in place/.test(out), out);
  assert(/OK    The Forms API works: it set a typed answer key and Verified email collection\./.test(out), out);
  assert(/NOTE  No TEMPLATE_FORM_ID/.test(out) && /NOTE  No SCHOOL_EMAIL/.test(out), out);
  assert(!/FIX/.test(out), out);
  const made = [...W.nodes.values()].slice(before);
  assert.strictEqual(made.length, 1);
  assert(made[0].trashed && made[0].mime === MIME.FORMS, 'only the temp form, now in the Trash');
  return out.split('\n').length + ' lines';
});

test('testSetup with the Forms API off names setup step 4', () => {
  const W = makeWorld({ apiMode: 'disabled' });
  run(W, 'testSetup');
  assert(/FIX   Forms API: Forms API 403: the Google Forms API isn't turned on for this script's Cloud project \(setup step 4\)/.test(lastLogs(W)), lastLogs(W));
});

test('testSetup with missing scopes says to allow access', () => {
  const W = makeWorld({ apiMode: 'unauthorized' });
  run(W, 'testSetup');
  assert(/FIX   Forms API: Forms API 403: access was refused/.test(lastLogs(W)), lastLogs(W));
});

test('testSetup: template not a quiz, bad ONLY, missing image, USE_FORMS_API false', () => {
  const W = makeWorld({ config: { ONLY: 'C-XX.9.9', USE_FORMS_API: false } });
  const tplNode = addTemplate(W, { isQuiz: false });
  W.config.TEMPLATE_FORM_ID = tplNode.id;
  const img = findLive(W, n => n.name === 'C-AR.4.3-chk-Q5.png')[0];
  img.trashed = true;
  run(W, 'testSetup');
  const out = lastLogs(W);
  assert(/FIX   1 images are missing from "images", for example C-AR.4.3-chk-Q5.png/.test(out), out);
  assert(/FIX   No form matches ONLY = "C-XX.9.9"/.test(out), out);
  assert(/FIX   The template "DPP template" is not a quiz yet/.test(out), out);
  assert(/NOTE  USE_FORMS_API is false, so typed answer keys go in the "Typed keys to add" tab for you to enter\.$/m.test(out), out);
  assert.strictEqual(W.fetches.length, 0);
});

function addTemplate(W, { isQuiz = true } = {}) {
  // a form the teacher made by hand: quiz settings plus a stray question and a section header
  const form = { title: 'DPP template', description: 'x', isQuiz, shuffle: false, confirmation: '', collectEmail: true,
    emailType: 'VERIFIED', limitOne: true, seq: 2, extra: { fromTemplate: true, releaseLater: false, showCorrect: false },
    items: [
      { id: 1, apiId: 'aaaa0001', qid: 'bbbb0001', kind: 'TEXT', title: 'Untitled question', required: false, points: 0, choices: [], validation: null, image: null, width: null, keys: null },
      { id: 2, apiId: 'aaaa0002', qid: 'bbbb0002', kind: 'MULTIPLE_CHOICE', title: 'Old', required: true, points: 1, choices: [{ value: 'Option 1', isCorrect: true }], validation: null, image: null, width: null, keys: null },
    ] };
  const id = '1TEMPLATExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  W.nodes.set(id, { id, kind: 'file', mime: MIME.FORMS, name: 'DPP template', parent: 'root', trashed: false, viewers: [], editors: [], form });
  return W.nodes.get(id);
}

// ───────────────────────────── builds ─────────────────────────────

function fullBuild(opts = {}) {
  const W = makeWorld(opts);
  W.config.ONLY = 'C-NSO.1.2';
  run(W, 'buildForms');
  drain(W);
  verifyBuild(W, { only: 'C-NSO.1.2', typed: opts.typed, schoolEmail: (opts.config || {}).SCHOOL_EMAIL });
  W.config.ONLY = '';
  const start = W.T;
  run(W, 'buildForms');
  const passes = 1 + drain(W);
  return { W, passes, elapsed: W.T - start };
}

test('test build of C-NSO.1.2 (3 forms) then the full build, triggers deleted after each fired', () => {
  const { W, passes, elapsed } = fullBuild();
  assert.deepStrictEqual(errorsOf(W), []);
  assert(!W.execs.some(e => e.killed), 'no run hit the 6-minute limit');
  const note = verifyBuild(W);
  assert.strictEqual(liveTriggers(W).length, 0, 'no triggers left');
  assert(W.maxLiveTriggers <= 2, 'at most 2 pending triggers at once, saw ' + W.maxLiveTriggers);
  assert.strictEqual(W.lock, null);
  assert(/All 102 forms are built/.test(lastLogs(W)), lastLogs(W));
  const longest = Math.max(...W.execs.map(e => e.end - e.start));
  const fetches = W.fetches.length;
  assert.strictEqual(fetches, 2 * MANIFEST.forms.length, 'one get + one batchUpdate per form');
  return `${note}; ${passes} runs over ${minutes(elapsed)} simulated min; longest run ${minutes(longest)} min`;
});

test('same build when fired one-time triggers stay listed until deleted', () => {
  const { W } = fullBuild({ firedTriggersStay: true });
  verifyBuild(W);
  assert.strictEqual(W.triggers.filter(t => !t.deleted).length, 0, 'every trigger deleted in the end');
  assert(Math.max(...W.execs.map(e => W.triggers.filter(t => t.createdBy === e.id).length)) <= 2);
});

test('slow Google (2x costs): still no run reaches 6 minutes', () => {
  const costs = { 'FormApp.create': 4000, 'ImageItem.setImage': 3000, 'File.getBlob': 600, add: 800, 'item.set': 300, 'Form.set': 600, 'UrlFetchApp.fetch': 1800, 'Range.setValues': 600, 'Range.getValues': 600, 'Sheet.appendRow': 600, 'File.moveTo': 1600, 'Drive.query': 800, 'Iterator.next': 20 };
  const { W, passes, elapsed } = fullBuild({ costs });
  verifyBuild(W);
  assert(!W.execs.some(e => e.killed));
  const longest = Math.max(...W.execs.map(e => e.end - e.start));
  assert(longest < 6 * MIN);
  return `${passes} runs, ${minutes(elapsed)} min, longest run ${minutes(longest)} min`;
});

test('a run cut off mid-form: the safety trigger resumes, the half-built form is trashed and rebuilt', () => {
  const W = makeWorld();
  let images = 0, hung = 0;
  W.hooks.push((W, what) => {
    if (what === 'ImageItem.setImage' && ++images % 97 === 0 && hung < 3) { hung++; W.T += 6 * MIN; } // Google hangs
  });
  run(W, 'buildForms');
  drain(W);
  assert.strictEqual(W.execs.filter(e => e.killed).length, 3, 'three runs were cut off');
  verifyBuild(W);
  const out = outFolder(W);
  const trashedForms = [...W.nodes.values()].filter(n => n.mime === MIME.FORMS && n.parent === out.id && n.trashed);
  assert.strictEqual(trashedForms.length, 3, 'the three half-built forms went to the Trash');
  assert.strictEqual(liveTriggers(W).length, 0);
  return `${W.execs.length} runs`;
});

test('a run cut off between creating a form and logging it leaves one stray form in My Drive, nothing else', () => {
  const W = makeWorld();
  let creates = 0;
  let armed = false;
  W.hooks.push((W, what) => {
    if (armed) { armed = false; W.T += 6 * MIN; }                  // the call right after the 20th create hangs
    if (what === 'FormApp.create' && ++creates === 20) armed = true;
  });
  run(W, 'buildForms');
  drain(W);
  verifyBuild(W);
  const strays = findLive(W, n => n.mime === MIME.FORMS && n.parent === 'root');
  assert.strictEqual(strays.length, 1);
  return 'stray: "' + strays[0].name + '"';
});

test('a missing image fails only its form; the run reports it; a rerun rebuilds only that form', () => {
  const W = makeWorld();
  const img = findLive(W, n => n.name === 'C-GR.1.3-re-Q2.png')[0];
  img.trashed = true;
  run(W, 'buildForms');
  drain(W);
  const { rows } = logRows(W);
  const failed = rows.filter(r => r.status !== 'built');
  assert.strictEqual(failed.length, 1);
  assert.strictEqual(failed[0].key, 'C-GR.1.3 Re-check');
  assert(/^failed: image C-GR.1.3-re-Q2.png is missing from the "images" folder$/.test(failed[0].status), failed[0].status);
  assert(/Finished, but 1 form\(s\) did not build: C-GR.1.3 Re-check/.test(lastLogs(W)), lastLogs(W));
  const halfBuilt = failed[0].id;
  img.trashed = false;
  const execsBefore = W.execs.length;
  run(W, 'buildForms');
  drain(W);
  verifyBuild(W);
  assert(W.nodes.get(halfBuilt).trashed, 'the half-built form went to the Trash');
  assert.strictEqual(W.execs.length - execsBefore, 1, 'one short run');
  return 'status said: ' + failed[0].status;
});

test('USE_FORMS_API false: no API calls; every typed key listed one answer per cell, as text', () => {
  const { W } = fullBuild({ config: { USE_FORMS_API: false }, typed: 'tab' });
  assert.strictEqual(W.fetches.length, 0);
  return verifyBuild(W, { typed: 'tab' });
});

test('Forms API turned off: forms still build; keys go to the tab with a warning per form', () => {
  const { W } = fullBuild({ apiMode: 'disabled', typed: 'tab' });
  const note = verifyBuild(W, { typed: 'tab' });
  const warns = logsOf(W).filter(l => /^warn: .*the Forms API step did not run \(Forms API 403: the Google Forms API isn't turned on/.test(l));
  assert.strictEqual(warns.length, MANIFEST.forms.length);
  return note;
});

test('Forms API busy (every 4th call 503): retries, so every key is still set', () => {
  const { W } = fullBuild({ apiFailEvery: 4 });
  verifyBuild(W);
  return `${W.fetches.length} API calls, ${W.calls['Utilities.sleep'] || 0} waits`;
});

test('template: forms are copies (settings kept), its own questions removed, template untouched', () => {
  const W = makeWorld();
  const tpl = addTemplate(W);
  const before = JSON.stringify(tpl.form);
  W.config.TEMPLATE_FORM_ID = tpl.id;
  run(W, 'buildForms');
  drain(W);
  assert.strictEqual(JSON.stringify(tpl.form), before, 'template unchanged');
  assert(!W.calls['FormApp.create'], 'no blank forms');
  assert(!W.calls['File.moveTo'] || W.calls['File.moveTo'] === 1, 'only the links sheet is moved');
  run(W, 'testSetup');
  assert(/OK    The template "DPP template" is a quiz/.test(lastLogs(W)), lastLogs(W));
  return verifyBuild(W, { template: true });
});

test('no API and no template: email collection turned on with FormApp; testSetup says to check it', () => {
  const W = makeWorld({ config: { ONLY: 'C-AR.1.1', USE_FORMS_API: false } });
  run(W, 'buildForms');
  drain(W);
  run(W, 'testSetup');
  assert(/check that Settings, Responses, Collect email addresses says Verified/.test(lastLogs(W)), lastLogs(W));
  return verifyBuild(W, { only: 'C-AR.1.1', typed: 'tab' });
});

test('SCHOOL_EMAIL: folder shared once as viewer; copy links carry authuser', () => {
  const email = 'cshaffer@school.example.org';
  const { W } = fullBuild({ config: { SCHOOL_EMAIL: email } });
  const out = outFolder(W);
  assert.deepStrictEqual(out.viewers, [email]);
  assert.strictEqual(W.calls['Folder.addViewer'], 1);
  return verifyBuild(W, { schoolEmail: email });
});

test('rerunning buildForms after everything is built changes nothing', () => {
  const { W } = fullBuild();
  const snapshot = JSON.stringify([...W.nodes.values()].map(n => [n.id, n.trashed, n.parent, n.form && n.form.items.length]));
  run(W, 'buildForms');
  assert.strictEqual(drain(W), 0);
  assert.strictEqual(JSON.stringify([...W.nodes.values()].map(n => [n.id, n.trashed, n.parent, n.form && n.form.items.length])), snapshot);
  assert(/All 102 forms are built/.test(lastLogs(W)));
  assert.strictEqual(liveTriggers(W).length, 0);
});

test('a setup problem (kit folder renamed) stops cleanly instead of retrying every 8 minutes', () => {
  const W = makeWorld();
  W.nodes.get(W.kitId).name = 'DPP Forms kit (old)';
  run(W, 'buildForms');
  assert(/There is no folder named "DPP Forms kit"/.test(W.execs[0].error.message));
  assert.strictEqual(liveTriggers(W).length, 0, 'no retry trigger left behind');
  assert.strictEqual(W.lock, null);
});

test('a second buildForms while one is running stops at once and changes nothing', () => {
  const W = makeWorld();
  W.lock = { owner: 'another run' };
  run(W, 'buildForms');
  assert(/Another run is already building forms/.test(lastLogs(W)));
  assert.strictEqual(W.triggers.length, 0);
  assert(!findLive(W, n => n.name === 'DPP Forms (built)').length);
});

test('startOver after a build: forms and links sheet trashed, then a clean rebuild', () => {
  const { W } = fullBuild();
  run(W, 'startOver');
  assert(/Moved 102 built forms and the links sheet to the Trash/.test(lastLogs(W)), lastLogs(W));
  const out = outFolder(W);
  assert.strictEqual(findLive(W, n => n.parent === out.id).length, 0);
  assert.strictEqual(W.props[STOP_KEY], undefined);
  run(W, 'buildForms');
  drain(W);
  return verifyBuild(W);
});

test('startOver while a build is running: the build stops at the next form; startOver then trashes everything', () => {
  const W = makeWorld();
  let creates = 0;
  // startOver() starts in another execution while form 30 is being built: it sets the stop flag
  W.hooks.push((W, what) => { if (what === 'FormApp.create' && ++creates === 30) W.props[STOP_KEY] = String(W.T); });
  run(W, 'buildForms');
  drain(W);
  assert(logsOf(W).some(l => /Stopped for startOver\(\)/.test(l)), 'build stopped');
  assert.strictEqual(liveTriggers(W).length, 0, 'and did not schedule another run');
  const { rows } = logRows(W);
  assert.strictEqual(rows.filter(r => r.status === 'built').length, 30, 'the form in progress was finished first');
  run(W, 'startOver');
  assert(/Moved 30 built forms/.test(lastLogs(W)), lastLogs(W));
  assert.strictEqual(W.props[STOP_KEY], undefined, 'flag cleared');
});

test('startOver waits for a running pass to let go of the lock', () => {
  const W = makeWorld();
  run(W, 'buildForms');
  W.lock = { owner: 'running pass', releaseAt: W.T + 40 * 1000 };
  run(W, 'startOver');
  assert(/Moved \d+ built forms/.test(lastLogs(W)), lastLogs(W));
  assert.strictEqual(liveTriggers(W).length, 0, 'the scheduled next pass was cancelled');
});

test('startOver gives up politely if the lock never frees', () => {
  const W = makeWorld();
  W.lock = { owner: 'stuck' };
  run(W, 'startOver');
  assert(/A build run is still going/.test(lastLogs(W)), lastLogs(W));
  assert.strictEqual(W.props[STOP_KEY], undefined);
});

test('a form built twice (failed, then rebuilt with keys off) has no stale typed-tab rows', () => {
  const W = makeWorld({ apiMode: 'disabled', config: { ONLY: 'C-NSO.1.2' } });
  run(W, 'buildForms');
  const { ss } = logRows(W);
  const tab = ss.sheets.find(s => s.name === 'Typed keys to add');
  const before = sheetRows(tab).length;
  // mark one form failed so it rebuilds
  const sh = ss.sheets.find(x => x.name === 'Forms');
  const r = sh.rows.findIndex(row => row && M.shown(row[1]) === 'C-NSO.1.2 Check');
  sh.rows[r][7] = 'failed: test';
  run(W, 'buildForms');
  assert.strictEqual(sheetRows(tab).length, before, 'rows replaced, not added');
  return verifyBuild(W, { only: 'C-NSO.1.2', typed: 'tab' });
});

test('very slow Google (4x costs): runs stay under 6 minutes', () => {
  const costs = { 'FormApp.create': 8000, 'ImageItem.setImage': 6000, 'File.getBlob': 1200, add: 1600, 'item.set': 600, 'Form.set': 1200, 'UrlFetchApp.fetch': 3600, 'Range.setValues': 1200, 'Range.getValues': 1200, 'Sheet.appendRow': 1200, 'File.moveTo': 3200, 'Drive.query': 1600, 'Iterator.next': 40 };
  const { W, passes, elapsed } = fullBuild({ costs });
  verifyBuild(W);
  const longest = Math.max(...W.execs.map(e => e.end - e.start));
  assert(!W.execs.some(e => e.killed) && longest < 6 * MIN);
  return `${passes} runs, ${minutes(elapsed)} min, longest run ${minutes(longest)} min`;
});

test('the chain of runs stops (e.g. the daily limit on script time): a manual run later finishes the job', () => {
  const W = makeWorld();
  run(W, 'buildForms');
  for (let k = 0; k < 2; k++) {                 // two more runs happen by themselves...
    const next = liveTriggers(W).sort((a, b) => a.at - b.at)[0];
    W.T = Math.max(W.T, next.at);
    next.fired = true;
    next.deleted = true;
    run(W, 'buildForms', next);
  }
  liveTriggers(W).forEach(t => { t.deleted = true; });   // ...then Google stops running them
  const builtBefore = logRows(W).rows.filter(r => r.status === 'built').length;
  assert(builtBefore > 0 && builtBefore < 102);
  W.T += 24 * 60 * MIN;                                   // the next day, one manual run
  run(W, 'buildForms');
  drain(W);
  return verifyBuild(W) + `; ${builtBefore} were built before the stop`;
});

test('a stop flag left over from a failed startOver (older than 10 minutes) is ignored', () => {
  const W = makeWorld({ config: { ONLY: 'C-AR.1.1' } });
  W.props[STOP_KEY] = String(W.T - 11 * MIN);
  run(W, 'buildForms');
  drain(W);
  return verifyBuild(W, { only: 'C-AR.1.1' });
});

test('a manual run while a cut-off build waits for its safety run: one chain, nothing doubled', () => {
  const W = makeWorld();
  let hung = false;
  W.hooks.push((W, what) => { if (!hung && what === 'ImageItem.setImage' && W.calls[what] === 40) { hung = true; W.T += 6 * MIN; } });
  run(W, 'buildForms');
  assert(W.execs[0].killed);
  W.T += 2 * MIN;                                // before the safety run is due
  run(W, 'buildForms');
  drain(W);
  assert(W.maxLiveTriggers <= 2, 'max pending triggers ' + W.maxLiveTriggers);
  return verifyBuild(W);
});

test('a passing Google error mid-form: that form is retried at once and the build finishes', () => {
  const W = makeWorld();
  let n = 0;
  W.hooks.push((W, what) => { if (what === 'Range.setValues' && ++n % 60 === 0) throw new Error('Service Spreadsheets failed while accessing document with id x.'); });
  run(W, 'buildForms');
  drain(W);
  const retried = logsOf(W).filter(l => /trying once more/.test(l)).length;
  assert(retried >= 3, 'some forms were retried: ' + retried);
  return verifyBuild(W) + `; ${retried} retries`;
});

test('a passing Google error outside a form: the run fails, the safety run carries on', () => {
  const W = makeWorld();
  let n = 0;
  W.hooks.push((W, what) => { if (what === 'Sheet.getDataRange' && ++n === 7) throw new Error('Service error: Spreadsheets'); });
  run(W, 'buildForms');
  drain(W);
  assert.strictEqual(W.execs.filter(e => e.error).length, 1);
  assert.strictEqual(W.props.DPP_FAILED_RUNS, undefined, 'counter cleared by the next good run');
  return verifyBuild(W);
});

test('a Google error that keeps happening: three failed runs, then the build stops by itself', () => {
  const W = makeWorld();
  W.hooks.push((W, what) => { if (what === 'Folder.getFoldersByName' && W.T > W.startFailAt) throw new Error('We\'re sorry, a server error occurred.'); });
  W.startFailAt = W.T + 20 * MIN;
  run(W, 'buildForms');
  drain(W);
  const failed = W.execs.filter(e => e.error).length;
  assert.strictEqual(failed, 3);
  assert.strictEqual(liveTriggers(W).length, 0);
  assert(/The build stopped/.test(logsOf(W).filter(l => /^error/.test(l)).pop()));
  return `${W.execs.length} runs, ${failed} failed`;
});

test('template mode, run cut off right after copying the template: the leftover copy is trashed at the end', () => {
  const W = makeWorld();
  const tpl = addTemplate(W);
  W.config.TEMPLATE_FORM_ID = tpl.id;
  let copies = 0, armed = false;
  W.hooks.push((W, what) => {
    if (armed) { armed = false; W.T += 6 * MIN; }
    if (what === 'File.makeCopy' && ++copies === 25) armed = true;
  });
  run(W, 'buildForms');
  drain(W);
  assert(/1 half-built leftover form\(s\) went to the Trash/.test(lastLogs(W)), lastLogs(W));
  return verifyBuild(W, { template: true });
});

test('a test run (ONLY) next to a full build leaves the test forms alone', () => {
  const W = makeWorld({ config: { ONLY: 'C-NSO.1.2' } });
  run(W, 'buildForms');
  const ids = logRows(W).rows.map(r => r.id);
  W.config.ONLY = '';
  run(W, 'buildForms');
  drain(W);
  verifyBuild(W);
  assert(ids.every(id => !W.nodes.get(id).trashed), 'the three test forms are kept, not rebuilt');
});

test('the Forms API refuses Verified emails: keys are still set; testSetup explains', () => {
  const W = makeWorld();
  W.refuseEmail = true;
  const tpl = addTemplate(W);
  W.config.TEMPLATE_FORM_ID = tpl.id;
  run(W, 'testSetup');
  assert(/NOTE  The Forms API set a typed answer key but not Verified emails\. Fine/.test(lastLogs(W)), lastLogs(W));
  W.config.ONLY = 'C-NSO.1.2';
  run(W, 'buildForms');
  assert(logsOf(W).some(l => /refused Verified emails/.test(l)));
  return verifyBuild(W, { only: 'C-NSO.1.2', template: true });
});

console.log(results.join('\n'));
console.log(`\n${passed} of ${results.length} tests passed`);
process.exitCode = passed === results.length ? 0 : 1;
