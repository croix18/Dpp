/**
 * DPP Weekly Checks: Google Forms builder
 *
 * Builds every form in the DPP Forms kit: the question images, the choices, the answer keys,
 * the points, the typing rule on typed answers, and the Teacher, Period and Level questions.
 *
 *   testSetup()   Checks the kit, the template and the Forms API. Changes nothing.
 *   buildForms()  Builds the forms. Each run works for up to 5 minutes, then starts the next
 *                 run by itself a minute later, until every form is built.
 *   startOver()   Moves every built form and the links sheet to the Trash.
 *   updateMessages()  For forms built with an earlier kit: puts this kit's message on the page students
 *                 see after they submit. Changes nothing else.
 *
 * Progress and links: the "DPP Forms links" sheet inside the "DPP Forms (built)" folder.
 */

const CONFIG = {
  KIT_FOLDER_NAME: 'DPP Forms kit',          // the folder you uploaded to My Drive
  OUTPUT_FOLDER_NAME: 'DPP Forms (built)',   // made inside the kit folder
  TEMPLATE_FORM_ID: '',                      // your "DPP template" form's ID (setup step 2)
  SCHOOL_EMAIL: '',                          // your school Google account; the built folder is shared with it (view only)
  TEACHERS: ['Mr. C. Shaffer', 'Mr. J. Shaffer'],
  PERIODS: ['1', '2', '3', '4', '5', '6', '7'],
  USE_FORMS_API: true,                       // sets typed answer keys and Verified emails (setup step 4); false = you type the keys
  ONLY: '',                                  // e.g. 'C-NSO.1.2' or 'Unit 9, Unit 10': builds just those forms
  IMAGE_WIDTH: 640,                          // pixels; Google Forms shows images up to 740 wide
};

const MANIFEST_NAME = 'forms_manifest.json';
const IMAGES_FOLDER_NAME = 'images';
const LOG_NAME = 'DPP Forms links';
const LOG_TAB = 'Forms';
const TYPED_TAB = 'Typed keys to add';
const PASS_LIMIT_MS = 5 * 60 * 1000;        // Apps Script stops a run at 6 minutes
const NEXT_PASS_MS = 60 * 1000;
const SAFETY_PASS_MS = 8 * 60 * 1000;       // restarts the build if a run is cut off mid-form
const STOP_KEY = 'DPP_STOP_BUILD';          // set by startOver() so a running build stops
const STOP_FRESH_MS = 10 * 60 * 1000;       // an older stop flag is left over from a failed startOver()
const FAILS_KEY = 'DPP_FAILED_RUNS';        // runs in a row that hit an error; the build stops at 3
const FORMS_API = 'https://forms.googleapis.com/v1/forms/';
const CONFIRMATION = 'Your answers are in. Choose View score to see your score and which questions you missed.';
const COLUMNS = ['Order', 'Form', 'Title', 'Questions', 'Calculator', 'Locked mode', 'Typed answer keys',
  'Status', 'Edit link', 'Copy link (open while signed in to your school account)', 'Form ID'];
const COL = { order: 1, key: 2, status: 8, id: 11 };

// ───────────────────────────── build ─────────────────────────────

function buildForms() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    console.log('Another run is already building forms, so this one stopped. Nothing is lost.');
    return;
  }
  const props = PropertiesService.getScriptProperties();
  try {
    const started = Date.now();
    scheduleRun_(SAFETY_PASS_MS);                    // if this run is cut off, the build carries on
    buildPass_(started);
    props.deleteProperty(FAILS_KEY);
  } catch (e) {
    const fails = Number(props.getProperty(FAILS_KEY) || 0) + 1;
    if (e.setup || fails >= 3) {                     // stop instead of retrying every 8 minutes
      deletePassTriggers_();
      props.deleteProperty(FAILS_KEY);
      console.error('The build stopped: ' + explain_(e));
    } else {
      props.setProperty(FAILS_KEY, String(fails));
      console.error(`This run hit an error, so the build tries again in about 8 minutes: ${explain_(e)}`);
    }
    throw e;
  } finally {
    lock.releaseLock();
  }
}

/** One run: build forms until they are all done or this run's time is nearly up. */
function buildPass_(started) {
  const kit = openKit_();
  const out = outputFolder_(kit.folder);
  shareWithSchool_(out);
  const ss = openLog_(out);
  const sheet = logSheet_(ss);
  const images = imageFiles_(kit.folder);
  const pick = pickForms_(kit.manifest.forms);
  if (pick.unknown.length) throw setupError_(onlyHelp_(pick.unknown));
  const forms = pick.forms;
  const props = PropertiesService.getScriptProperties();

  const rows = readLog_(sheet);
  let built = 0;
  let slowest = 0;                                   // the longest one form has taken in this run
  for (const F of forms) {
    const prev = rows[F.key];
    if (prev && prev.status === 'built') continue;
    const stop = props.getProperty(STOP_KEY);
    if (stop && Date.now() - Number(stop) < STOP_FRESH_MS) {
      deletePassTriggers_();
      console.log(`Stopped for startOver() after building ${built} forms in this run.`);
      return;
    }
    if (Date.now() - started + 1.5 * slowest > PASS_LIMIT_MS) {     // the next form might not finish in time
      scheduleRun_(NEXT_PASS_MS);
      sortLog_(sheet);
      const now = readLog_(sheet);
      const left = forms.filter(f => !now[f.key] || now[f.key].status !== 'built').length;
      console.log(`This run built ${built} forms; ${left} to go. The next run starts by itself in about a minute. ` +
        'If the Status column in the links sheet stops changing for 15 minutes, run buildForms() again.');
      return;
    }
    if (prev && prev.id) trash_(prev.id);            // half-built by a run that was cut off, or failed
    const t0 = Date.now();
    let row = prev ? prev.row : 0;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        if (attempt === 2) Utilities.sleep(3000);
        if (!row) row = addRow_(sheet, F);
        buildOne_(F, kit.manifest, images, out, ss, sheet, row);
        built++;
        break;
      } catch (e) {
        console.error(`${F.key} did not build${attempt === 1 ? ' (trying once more)' : ''}: ${explain_(e)}`);
        if (!row) continue;
        try {
          if (attempt === 1) trash_(String(sheet.getRange(row, COL.id).getValue() || ''));
          sheet.getRange(row, COL.status).setValue('failed: ' + explain_(e));
        } catch (e2) { /* the row stays "building", so the next run rebuilds it */ }
      }
    }
    slowest = Math.max(slowest, Date.now() - t0);
  }

  sortLog_(sheet);
  const after = readLog_(sheet);
  const left = forms.filter(f => !after[f.key] || after[f.key].status !== 'built');
  if (left.length) {
    deletePassTriggers_();
    console.warn(`Finished, but ${left.length} form(s) did not build: ${left.map(f => f.key).join(', ')}. ` +
      'The Status column in the links sheet says why. Fix that, then run buildForms() again; it only rebuilds those.');
    return;
  }
  const strays = trashStrays_(out, after);
  deletePassTriggers_();
  console.log(`All ${forms.length} forms are built in "${CONFIG.OUTPUT_FOLDER_NAME}". Open "${LOG_NAME}" there for the links.` +
    (strays ? ` (${strays} half-built leftover form(s) went to the Trash.)` : ''));
}

/** One form: copy the template (or start blank), then add every item in order. */
function buildOne_(F, M, images, out, ss, sheet, row) {
  const form = newForm_(F, out);
  writeRow_(sheet, row, F, form, 'building', '');     // a run cut off from here on is cleaned up next run
  if (!CONFIG.TEMPLATE_FORM_ID) {
    DriveApp.getFileById(form.getId()).moveTo(out);
    form.setCollectEmail(true);                      // the Forms API makes this "Verified" below
  }
  form.setLimitOneResponsePerUser(true);
  dropTypedRows_(ss, F.key);                         // rows left by an earlier try at this form

  form.getItems().forEach(item => form.deleteItem(item));        // a template's own questions
  form.setTitle(F.title);
  form.setDescription(F.description);
  form.setIsQuiz(true);
  form.setShuffleQuestions(false);
  form.setConfirmationMessage(CONFIRMATION);

  form.addMultipleChoiceItem().setTitle('Teacher').setChoiceValues(CONFIG.TEACHERS).setRequired(true);
  form.addListItem().setTitle('Period').setChoiceValues(CONFIG.PERIODS).setRequired(true);

  const typed = [];
  F.questions.forEach(Q => {
    addImage_(form, images, Q.image);
    const title = 'Question ' + Q.n;
    if (Q.type === 'mc' || Q.type === 'cb') {
      const item = Q.type === 'mc' ? form.addMultipleChoiceItem() : form.addCheckboxItem();
      item.setTitle(title)
        .setChoices(Q.options.map(o => item.createChoice(o, Q.correct.indexOf(o) >= 0)))
        .setPoints(1)
        .setRequired(true);
    } else {
      const rule = FormApp.createTextValidation()
        .setHelpText(M.regex_error)
        .requireTextMatchesPattern(M.regex)
        .build();
      form.addTextItem().setTitle(title).setPoints(1).setRequired(true).setValidation(rule);
      typed.push({ title: title, accept: Q.accept });
    }
  });

  if (F.level_image) {
    addImage_(form, images, F.level_image);
    form.addMultipleChoiceItem()
      .setTitle('Look at the scale above. Which level are you at right now?')
      .setChoiceValues(['Level 1', 'Level 2', 'Level 3', 'Level 4'])
      .setRequired(true);
  }

  let keys = typed.length ? 'add by hand' : 'none';
  if (CONFIG.USE_FORMS_API) {
    try {
      apiUpdate_(form.getId(), typed);
      if (typed.length) keys = 'set';
    } catch (e) {
      console.warn(`${F.key}: the Forms API step did not run (${e.message}). ` +
        (typed.length ? `Its typed answer keys are listed in "${TYPED_TAB}". ` : '') + 'Check its email setting says Verified.');
    }
  }
  if (keys === 'add by hand') listTypedKeys_(ss, F, form, typed);
  writeRow_(sheet, row, F, form, 'built', keys);
}

function newForm_(F, out) {
  if (!CONFIG.TEMPLATE_FORM_ID) return FormApp.create(F.title);
  const copy = DriveApp.getFileById(CONFIG.TEMPLATE_FORM_ID).makeCopy(F.title, out);
  try {
    return FormApp.openById(copy.getId());
  } catch (e) {
    copy.setTrashed(true);
    throw e;
  }
}

function addImage_(form, images, name) {
  const file = images[name];
  if (!file) throw new Error(`image ${name} is missing from the "${IMAGES_FOLDER_NAME}" folder`);
  form.addImageItem().setImage(file.getBlob()).setWidth(CONFIG.IMAGE_WIDTH);
}

// ──────────────────── Forms API: typed answer keys, Verified emails ────────────────────
// Apps Script's FormApp cannot set the answer key of a short-answer question or choose
// "Verified" email collection, so these go through the Google Forms API, which needs a
// standard Cloud project with that API turned on (setup step 4).

function apiUpdate_(formId, typed) {
  const form = formsApi_('get', formId);
  const requests = [{ updateSettings: { settings: { emailCollectionType: 'VERIFIED' }, updateMask: 'emailCollectionType' } }];
  (form.items || []).forEach((item, index) => {
    const want = typed.find(t => t.title === item.title);
    const q = item.questionItem && item.questionItem.question;
    if (!want || !q || !q.textQuestion) return;
    requests.push({
      updateItem: {
        item: {
          itemId: item.itemId,
          questionItem: {
            question: {
              questionId: q.questionId,
              textQuestion: q.textQuestion,
              grading: { pointValue: 1, correctAnswers: { answers: want.accept.map(v => ({ value: String(v) })) } },
            },
          },
        },
        location: { index: index },
        updateMask: 'questionItem.question.grading',
      },
    });
  });
  if (requests.length - 1 !== typed.length) {
    throw new Error(`found ${requests.length - 1} of the ${typed.length} typed questions in the form`);
  }
  try {
    formsApi_('batchUpdate', formId, { requests: requests });
  } catch (e) {
    if (!/^Forms API 400/.test(e.message) || requests.length === 1) throw e;
    formsApi_('batchUpdate', formId, { requests: requests.slice(1) });     // the keys alone
    console.warn(`The Forms API set the answer keys but refused Verified emails (${e.message}). ` +
      (CONFIG.TEMPLATE_FORM_ID ? "The template's setting covers it." : 'Set Collect email addresses to Verified on each copy.'));
  }
}

function formsApi_(kind, formId, body) {
  const options = {
    method: kind === 'batchUpdate' ? 'post' : 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };
  if (body) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(body);
  }
  const url = FORMS_API + formId + (kind === 'batchUpdate' ? ':batchUpdate' : '');
  let res = UrlFetchApp.fetch(url, options);
  for (let attempt = 1; attempt <= 3 && [429, 500, 502, 503, 504].indexOf(res.getResponseCode()) >= 0; attempt++) {
    Utilities.sleep(2000 * attempt);                 // Google was busy: wait, then try again
    res = UrlFetchApp.fetch(url, options);
  }
  const code = res.getResponseCode();
  const text = res.getContentText();
  if (code === 200) return JSON.parse(text || '{}');
  let msg = text;
  try { msg = JSON.parse(text).error.message; } catch (e) { /* keep the raw text */ }
  if (/has not been used|is disabled|SERVICE_DISABLED|accessNotConfigured/i.test(text)) {
    msg = "the Google Forms API isn't turned on for this script's Cloud project (setup step 4): " + msg;
  } else if (code === 401 || code === 403) {
    msg = 'access was refused (' + msg + '). Run testSetup(), tick every box on the Allow screen, and check the Cloud project number in Project Settings.';
  }
  throw new Error(`Forms API ${code}: ${msg}`);
}

// ───────────────────────────── check ─────────────────────────────

function testSetup() {
  const lines = [];
  const ok = t => lines.push('OK    ' + t);
  const fix = t => lines.push('FIX   ' + t);
  const note = t => lines.push('NOTE  ' + t);

  let kit;
  try {
    kit = openKit_();
    ok(`Found "${CONFIG.KIT_FOLDER_NAME}" with ${kit.manifest.forms.length} forms in ${MANIFEST_NAME}.`);
  } catch (e) {
    fix(explain_(e));
    console.log(lines.join('\n'));
    return;
  }

  try {
    const images = imageFiles_(kit.folder);
    const missing = [];
    kit.manifest.forms.forEach(f => {
      f.questions.forEach(q => { if (!images[q.image]) missing.push(q.image); });
      if (f.level_image && !images[f.level_image]) missing.push(f.level_image);
    });
    if (missing.length) fix(`${missing.length} images are missing from "${IMAGES_FOLDER_NAME}", for example ${missing.slice(0, 3).join(', ')}.`);
    else ok(`All ${Object.keys(images).length} images are in place.`);
  } catch (e) {
    fix(explain_(e));
  }

  const pick = pickForms_(kit.manifest.forms);
  if (pick.unknown.length) fix(onlyHelp_(pick.unknown));
  else if (CONFIG.ONLY) ok(`ONLY picks ${pick.forms.length} forms: ${CONFIG.ONLY}.`);

  if (CONFIG.TEMPLATE_FORM_ID) {
    try {
      const t = FormApp.openById(CONFIG.TEMPLATE_FORM_ID);
      if (t.isQuiz()) ok(`The template "${t.getTitle()}" is a quiz.`);
      else fix(`The template "${t.getTitle()}" is not a quiz yet: open it, Settings, turn on "Make this a quiz".`);
    } catch (e) {
      fix(`Can't open the template form (${explain_(e)}). Check TEMPLATE_FORM_ID.`);
    }
  } else {
    note('No TEMPLATE_FORM_ID, so forms use Google\'s default quiz settings: students see the correct answers after they submit. Setup step 2 fixes that.');
  }

  if (CONFIG.SCHOOL_EMAIL) ok(`The built folder will be shared (view only) with ${CONFIG.SCHOOL_EMAIL}.`);
  else note('No SCHOOL_EMAIL, so share the "DPP Forms (built)" folder with your school account yourself (Viewer is enough).');

  if (CONFIG.USE_FORMS_API) {
    let temp = null;
    try {
      temp = FormApp.create('DPP Forms API test (safe to delete)');
      temp.setIsQuiz(true);
      temp.addTextItem().setTitle('Question 1').setPoints(1);
      apiUpdate_(temp.getId(), [{ title: 'Question 1', accept: ['12', '12.0'] }]);
      const back = formsApi_('get', temp.getId());
      const g = back.items && back.items[0] && back.items[0].questionItem.question.grading;
      const keyOk = !!(g && g.correctAnswers && g.correctAnswers.answers.length === 2);
      const emailOk = !!(back.settings && back.settings.emailCollectionType === 'VERIFIED');
      if (keyOk && emailOk) ok('The Forms API works: it set a typed answer key and Verified email collection.');
      else if (keyOk && CONFIG.TEMPLATE_FORM_ID) note('The Forms API set a typed answer key but not Verified emails. Fine: forms get Verified emails from the template (step 2).');
      else if (keyOk) fix('The Forms API set a typed answer key but not Verified emails. Make the template in step 2 and put its ID in TEMPLATE_FORM_ID.');
      else fix('The Forms API answered, but the typed answer key did not stick.');
    } catch (e) {
      fix('Forms API: ' + explain_(e));
    } finally {
      if (temp) trash_(temp.getId());
    }
  } else {
    note(`USE_FORMS_API is false, so typed answer keys go in the "${TYPED_TAB}" tab for you to enter` +
      (CONFIG.TEMPLATE_FORM_ID ? '.' : ', and on your first copy check that Settings, Responses, Collect email addresses says Verified.'));
  }

  if (ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'buildForms')) {
    note('A build is in progress: its next run is already scheduled.');
  }
  console.log(lines.join('\n'));
}

// ───────────────────────────── start over ─────────────────────────────

function startOver() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty(STOP_KEY, String(Date.now()));   // a build that is running stops before its next form
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(4 * 60 * 1000)) {
    props.deleteProperty(STOP_KEY);
    console.log('A build run is still going. Wait a few minutes, then run startOver() again.');
    return;
  }
  try {
    deletePassTriggers_();
    props.deleteProperty(FAILS_KEY);
    const kit = openKit_();
    const out = firstLive_(kit.folder.getFoldersByName(CONFIG.OUTPUT_FOLDER_NAME));
    let n = 0;
    if (out) {
      const forms = out.getFilesByType(MimeType.GOOGLE_FORMS);
      while (forms.hasNext()) {
        const f = forms.next();
        if (!f.isTrashed()) { f.setTrashed(true); n++; }
      }
      const logs = out.getFilesByName(LOG_NAME);
      while (logs.hasNext()) {
        const f = logs.next();
        if (!f.isTrashed()) f.setTrashed(true);
      }
    }
    console.log(`Moved ${n} built forms and the links sheet to the Trash (recoverable for 30 days). Run buildForms() to build again.`);
  } finally {
    props.deleteProperty(STOP_KEY);
    lock.releaseLock();
  }
}

// ───────────────────────────── forms built with an earlier kit ─────────────────────────────

/** Earlier kits told students to copy their score onto a paper progress strip. This puts the current
 *  message on every built form in the links sheet and changes nothing else. About a minute for all 102. */
function updateMessages() {
  const kit = openKit_();
  const out = firstLive_(kit.folder.getFoldersByName(CONFIG.OUTPUT_FOLDER_NAME));
  const file = out && firstLive_(out.getFilesByName(LOG_NAME));
  if (!file) {
    console.log('No forms are built yet, so there is nothing to update. buildForms() already uses the new message.');
    return;
  }
  const rows = readLog_(logSheet_(SpreadsheetApp.openById(file.getId())));
  let n = 0;
  const missed = [];
  Object.keys(rows).forEach(key => {
    const r = rows[key];
    if (r.status !== 'built' || !r.id) return;
    try {
      FormApp.openById(r.id).setConfirmationMessage(CONFIRMATION);
      n++;
    } catch (e) {
      missed.push(`${key} (${explain_(e)})`);
    }
  });
  console.log(`Updated the message on ${n} built forms.` + (missed.length ? ` Could not open: ${missed.join('; ')}.` : ''));
}

// ───────────────────────────── helpers ─────────────────────────────

/** The forms ONLY names: benchmark IDs (C-AR.1.1), form names (C-AR.1.1 Check) or units (Unit 9), separated by commas. */
function pickForms_(forms) {
  const parts = String(CONFIG.ONLY || '').split(/[,;]/).map(t => t.trim()).filter(String);
  if (!parts.length) return { forms: forms, unknown: [] };
  const hit = (f, t) => {
    const u = t.match(/^unit\s*0*(\d+)$/i);
    return u ? f.unit === Number(u[1]) : (f.id.toLowerCase() === t.toLowerCase() || f.key.toLowerCase() === t.toLowerCase());
  };
  return { forms: forms.filter(f => parts.some(t => hit(f, t))), unknown: parts.filter(t => !forms.some(f => hit(f, t))) };
}

function onlyHelp_(unknown) {
  return `Nothing in the kit matches ${unknown.map(t => '"' + t + '"').join(', ')} in ONLY. ` +
    'Use benchmark IDs like C-NSO.1.2, units like Unit 9, separated by commas, or leave it blank.';
}

function setupError_(message) {
  const e = new Error(message);
  e.setup = true;                                     // a setup problem: retrying will not help
  return e;
}

function explain_(e) {
  const m = String((e && e.message) || e);
  if (/has not been used|is disabled|SERVICE_DISABLED|accessNotConfigured/i.test(m) && !/^Forms API/.test(m)) {
    const api = /drive/i.test(m) ? 'Google Drive API' : /forms/i.test(m) ? 'Google Forms API' : 'API named here';
    return `Turn on the ${api} in your Cloud project (setup step 4), wait a minute, then run this again. Google said: ${m}`;
  }
  return m;
}

function openKit_() {
  const folder = firstLive_(DriveApp.getFoldersByName(CONFIG.KIT_FOLDER_NAME));
  if (!folder) {
    throw setupError_(`There is no folder named "${CONFIG.KIT_FOLDER_NAME}" in your Drive. Upload that folder from the zip to My Drive first.`);
  }
  const file = firstLive_(folder.getFilesByName(MANIFEST_NAME));
  if (!file) throw setupError_(`"${MANIFEST_NAME}" is missing from "${CONFIG.KIT_FOLDER_NAME}".`);
  return { folder: folder, manifest: JSON.parse(file.getBlob().getDataAsString('UTF-8')) };
}

function firstLive_(iterator) {
  while (iterator.hasNext()) {
    const x = iterator.next();
    if (!x.isTrashed()) return x;
  }
  return null;
}

function imageFiles_(kitFolder) {
  const folder = firstLive_(kitFolder.getFoldersByName(IMAGES_FOLDER_NAME));
  if (!folder) throw setupError_(`The "${IMAGES_FOLDER_NAME}" folder is missing from "${CONFIG.KIT_FOLDER_NAME}".`);
  const map = {};
  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    if (!f.isTrashed()) map[f.getName()] = f;
  }
  return map;
}

function outputFolder_(kitFolder) {
  return firstLive_(kitFolder.getFoldersByName(CONFIG.OUTPUT_FOLDER_NAME)) || kitFolder.createFolder(CONFIG.OUTPUT_FOLDER_NAME);
}

function shareWithSchool_(out) {
  if (!CONFIG.SCHOOL_EMAIL) return;
  const email = CONFIG.SCHOOL_EMAIL.toLowerCase();
  const has = out.getViewers().concat(out.getEditors()).some(u => String(u.getEmail()).toLowerCase() === email);
  if (!has) out.addViewer(CONFIG.SCHOOL_EMAIL);
}

function openLog_(out) {
  const file = firstLive_(out.getFilesByName(LOG_NAME));
  if (file) return SpreadsheetApp.openById(file.getId());
  const ss = SpreadsheetApp.create(LOG_NAME);
  DriveApp.getFileById(ss.getId()).moveTo(out);
  const sheet = ss.getSheets()[0];
  sheet.setName(LOG_TAB);
  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(COL.key, 150);
  sheet.setColumnWidth(3, 380);
  return ss;
}

function logSheet_(ss) {
  return ss.getSheetByName(LOG_TAB) || ss.getSheets()[0];
}

function readLog_(sheet) {
  const values = sheet.getDataRange().getValues();
  const map = {};
  for (let r = 1; r < values.length; r++) {
    const key = values[r][COL.key - 1];
    if (key) map[key] = { row: r + 1, status: String(values[r][COL.status - 1] || ''), id: String(values[r][COL.id - 1] || '') };
  }
  return map;
}

function sortLog_(sheet) {
  const n = sheet.getLastRow() - 1;
  if (n > 1) sheet.getRange(2, 1, n, COLUMNS.length).sort(COL.order);
}

function addRow_(sheet, F) {
  sheet.appendRow([F.order, F.key, F.title, F.questions.length, F.calc === 'yes' ? 'allowed' : 'no', F.locked, '', 'queued', '', '', '']);
  return sheet.getLastRow();
}

function writeRow_(sheet, row, F, form, status, keys) {
  const id = form.getId();
  const copy = 'https://docs.google.com/forms/d/' + id + '/copy' +
    (CONFIG.SCHOOL_EMAIL ? '?authuser=' + encodeURIComponent(CONFIG.SCHOOL_EMAIL) : '');
  sheet.getRange(row, 1, 1, COLUMNS.length).setValues([[F.order, F.key, F.title, F.questions.length,
    F.calc === 'yes' ? 'allowed' : 'no', F.locked, keys, status, form.getEditUrl(), copy, id]]);
}

/** The fallback when the Forms API is off: every typed answer key, one accepted answer per cell. */
function listTypedKeys_(ss, F, form, typed) {
  let tab = ss.getSheetByName(TYPED_TAB);
  if (!tab) {
    tab = ss.insertSheet(TYPED_TAB);
    tab.appendRow(['Form', 'Question', 'Edit link',
      'Accepted answers: add each one, then tick "Mark all other answers incorrect"']);
    tab.getRange(1, 1, 1, 4).setFontWeight('bold');
    tab.setFrozenRows(1);
  }
  // The leading ' keeps Sheets from turning 2/7 into a date or 4 1/3 into 4.33; it does not show.
  typed.forEach(t => tab.appendRow([F.key, t.title, form.getEditUrl()].concat(t.accept.map(v => "'" + v))));
}

function dropTypedRows_(ss, key) {
  const tab = ss.getSheetByName(TYPED_TAB);
  if (!tab) return;
  const values = tab.getDataRange().getValues();
  for (let r = values.length; r >= 2; r--) {
    if (values[r - 1][0] === key) tab.deleteRow(r);
  }
}

/** Forms in the built folder that the links sheet doesn't know: copies left by a run that was cut off. */
function trashStrays_(out, rows) {
  const known = {};
  Object.keys(rows).forEach(k => { if (rows[k].id) known[rows[k].id] = true; });
  let n = 0;
  const files = out.getFilesByType(MimeType.GOOGLE_FORMS);
  while (files.hasNext()) {
    const f = files.next();
    if (!f.isTrashed() && !known[f.getId()]) { f.setTrashed(true); n++; }
  }
  return n;
}

/** Schedules the next buildForms run and removes any other scheduled run. */
function scheduleRun_(afterMs) {
  const next = ScriptApp.newTrigger('buildForms').timeBased().after(afterMs).create();
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'buildForms' && t.getUniqueId() !== next.getUniqueId()) ScriptApp.deleteTrigger(t);
  });
}

function deletePassTriggers_() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'buildForms') ScriptApp.deleteTrigger(t);
  });
}

function trash_(id) {
  if (!id) return;
  try { DriveApp.getFileById(id).setTrashed(true); } catch (e) { /* already gone */ }
}
