// DPP check bank build, v2: draw OR load a frozen edition, apply patches, render with Cadence's own typesetting.
//   FROZEN=frozen_ed4.json PATCHES=patches_ed4.json node build_bank2.js
// Without FROZEN it draws a fresh edition from cadence.html (seeded), with a cross-set generator cap.
// Outputs: DPP_Check_Bank_v1.pdf, plan_out.json (the plan after patches), patch_report.json, items_dump.json
const { chromium } = require('playwright');
const fs = require('fs');
const S = JSON.parse(fs.readFileSync('scales.json', 'utf8'));
const BACKSTOPS = [
  ['Q2', 'Units 2-5', ['MA.7.DP.2.2', 'MA.7.NSO.2.2', 'MA.7.NSO.2.3', 'MA.7.GR.1.2', 'MA.7.GR.1.3']],
  ['Q3', 'Units 2-9', ['MA.7.NSO.2.2', 'MA.7.GR.1.5', 'MA.7.AR.3.2', 'MA.7.AR.3.1', 'MA.7.AR.1.1']],
  ['Q4', 'Units 2-12', ['MA.7.NSO.2.3', 'MA.7.AR.3.1', 'MA.7.AR.2.2', 'MA.7.AR.4.2', 'MA.7.GR.2.3']],
];
const FROZEN = process.env.FROZEN ? JSON.parse(fs.readFileSync(process.env.FROZEN, 'utf8')) : null;
const PATCHES = process.env.PATCHES ? JSON.parse(fs.readFileSync(process.env.PATCHES, 'utf8')) : [];
const CADENCE = process.env.CADENCE || 'cadence.html';

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text().slice(0, 200)); });
  await p.addInitScript(() => { let a = 20261026 >>> 0; Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; });
  await p.goto('file:///home/claude/dpp/' + CADENCE);
  await p.waitForTimeout(1500);

  const PAGES = fs.existsSync('pages.json') ? JSON.parse(fs.readFileSync('pages.json', 'utf8')) : {};
  const result = await p.evaluate(({ S, BACKSTOPS, PAGES, FROZEN, PATCHES }) => {
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const clone = o => JSON.parse(JSON.stringify(o));
    const ptxt = s => plain(String(s == null ? '' : s));

    // ---------- numbers, templates, overlap (used by the fresh draw's dedupe and by patch redraws) ----------
    const CONST = new Set(['3.14', '2.2', '2.54', '3.785', '1.609', '0.62', '1.61', '28.35', '0.454', '2.205', '60', '100', '1000', '360', '12', '24', '10', '22/7']);
    const toks = t => {
      const out = [];
      String(t).replace(/−/g, '-').replace(/(\d+(?:,\d{3})*(?:\.\d+)?)(?:\s*\/\s*(\d+))?/g, (m, a, d) => {
        a = a.replace(/,/g, ''); const raw = d ? a + '/' + d : a; const v = d ? (+a) / (+d) : +a;
        out.push({ raw, v: Math.round(v * 1e6) / 1e6 }); return m;
      });
      return out;
    };
    const strongV = tk => !CONST.has(tk.raw) && !([0.5, 0.25, 0.75, 1.5, 2.5].includes(tk.v)) && (Math.abs(tk.v - Math.round(tk.v)) > 1e-9 ? true : tk.v >= 13);
    const qOf = o => ptxt(o.q) + ' ' + (o.opts || []).map(ptxt).join(' ') + ' ' + (o.rows || []).map(ptxt).join(' ');
    const tmplOf = o => ptxt(o.q).replace(/\b[A-Z][a-z]+\b/g, 'NAME').toLowerCase().replace(/[\d.,−\-\/]+/g, '#').slice(0, 60);
    const overlap = (cand, others) => {
      const cq = toks(qOf(cand)), ca = toks(ptxt(cand.a));
      let score = 0; const why = [];
      for (const o of others) {
        const oq = toks(qOf(o)), oa = toks(ptxt(o.a));
        const oqv = new Set(oq.filter(strongV).map(t => t.v)), oav = new Set(oa.filter(strongV).map(t => t.v));
        const sq = [...new Set(cq.filter(strongV).map(t => t.v))].filter(v => oqv.has(v));
        if (sq.length) { score += 3 * sq.length; why.push('givens ' + sq.join(',')); }
        const x1 = [...new Set(ca.filter(strongV).map(t => t.v))].filter(v => oqv.has(v) || oav.has(v));
        const x2 = [...new Set(oa.filter(strongV).map(t => t.v))].filter(v => cq.some(t => t.v === v));
        if (x1.length || x2.length) { score += 5 * (x1.length + x2.length); why.push('answer/given ' + [...x1, ...x2].join(',')); }
        const big = v => v >= 3;
        const shAll = [...new Set(cq.map(t => t.v))].filter(v => oq.some(t => t.v === v));
        const shBig = shAll.filter(big);
        if (shBig.length >= 2) { score += 2 * (shBig.length - 1); why.push('numbers ' + shBig.join(',')); }
        if (tmplOf(cand) === tmplOf(o) && shAll.length >= 2) { score += 4; why.push('same template, shared ' + shAll.join(',')); }
        const a1 = ptxt(cand.a).replace(/^[A-H]\.\s*/, '').trim(), a2 = ptxt(o.a).replace(/^[A-H]\.\s*/, '').trim();
        if (a1.length > 2 && a1 === a2) { score += 2; why.push('same answer'); }
      }
      return { score, why };
    };

    // ---------- fresh draw (only when no frozen edition is given) ----------
    let plan;
    if (FROZEN) plan = clone(FROZEN);
    else {
      plan = { bench: {}, back: {} };
      const used = new Set();
      let setGens = new Set(), benchAns = new Set(), benchGenSets = new Map(), curSet = '';
      const mk = (code, hr) => {
        const bankN = getBank(code, hr).length;
        const keyOf = c => { const t = ptxt(c.q).toLowerCase(); const m = t.match(/trapezoid|parallelogram|rhombus|rectangle|triangle|circle|cylinder|semicircle|square/); return m ? 'shape:' + m[0] : 'stem:' + t.replace(/[\d.,−\-\/]+/g, '#').slice(0, 48); };
        const ansOf = c => { const a = ptxt(c.a).toLowerCase().replace(/\s+/g, ' ').trim(); return /^[a-e]\.?$/.test(a) ? 'ans:' + Math.random() : 'ans:' + a; };
        const genKey = c => hr + ':' + c._genIdx;
        let best = null, bestScore = -Infinity;
        for (let t = 0; t < 14; t++) {
          let c = null; for (let r = 0; r < 6 && !c; r++) c = buildProblem(code, hr, used, 14); if (!c && hr) for (let r = 0; r < 6 && !c; r++) c = buildProblem(code, false, used, 14); if (!c) break;
          const sets = benchGenSets.get(genKey(c)) || new Set();
          const capHit = !sets.has(curSet) && sets.size >= 2;          // a generator may appear in at most two of {chk, re, cmp}
          const score = (setGens.has(keyOf(c)) ? 0 : 2) + (setGens.has(genKey(c)) ? 0 : 1) + (setGens.has('tmpl:' + tmplOf(c)) || benchAns.has(ansOf(c)) ? -3 : 0) + (capHit ? -4 : 0);
          if (score > bestScore) { best = c; bestScore = score; }
          if (score === 3 || (bankN <= 1 && score >= 2)) break;
        }
        if (!best) throw new Error('no item ' + code);
        setGens.add(keyOf(best)); setGens.add(genKey(best)); setGens.add('tmpl:' + tmplOf(best)); benchAns.add(ansOf(best));
        const sg = benchGenSets.get(genKey(best)) || new Set(); sg.add(curSet); benchGenSets.set(genKey(best), sg);
        return best;
      };
      S.order.forEach(([u, t, codes]) => codes.forEach(code => {
        benchAns = new Set(); benchGenSets = new Map();
        setGens = new Set(); curSet = 'chk'; const chk = [mk(code, false), mk(code, false), mk(code, false), mk(code, false), mk(code, true)];
        setGens = new Set(); curSet = 're'; const re = [mk(code, false), mk(code, false), mk(code, false)];
        setGens = new Set(); curSet = 'cmp'; const cmp = [mk(code, false), mk(code, false)];
        plan.bench[code] = clone({ chk, re, cmp });
      }));
      BACKSTOPS.forEach(([q, span, codes]) => { benchAns = new Set(); setGens = new Set(); benchGenSets = new Map(); curSet = 'back'; plan.back[q] = clone(codes.map(c => mk(c, false))); });
    }

    // ---------- patches: text edits on a frozen item, or a constrained redraw of one slot ----------
    const report = [];
    const fieldGet = (o, f) => f.startsWith('opts.') ? o.opts[+f.slice(5)] : o[f];
    const fieldSet = (o, f, v) => { if (f.startsWith('opts.')) o.opts[+f.slice(5)] = v; else o[f] = v; };
    const TEXT_FIELDS = o => ['q', 'a', 's', 'ft', 'fig', 'inst', ...(o.opts || []).map((_, i) => 'opts.' + i), ...(o.rows || []).map((_, i) => 'rows.' + i)];
    for (const P of PATCHES) {
      const [code, setn, idx] = P.slot.split('/'); const i = +idx;
      const arr = setn === 'back' ? plan.back[code] : plan.bench[code][setn];
      const before = clone(arr[i]);
      const rep = { slot: P.slot, why: P.why, kind: P.redraw ? 'redraw' : 'edit', ok: true, notes: [] };
      if (P.edit) {
        for (const E of P.edit) {
          const fields = E.field === '*' ? TEXT_FIELDS(arr[i]) : [E.field];
          let hits = 0;
          for (const f of fields) {
            if (f.startsWith('rows.')) { const k = +f.slice(5); const v = arr[i].rows[k]; if (typeof v === 'string' && v.includes(E.find)) { arr[i].rows[k] = v.split(E.find).join(E.replace); hits++; } continue; }
            const v = fieldGet(arr[i], f);
            if (typeof v === 'string' && v.includes(E.find)) { fieldSet(arr[i], f, v.split(E.find).join(E.replace)); hits++; }
          }
          if (!hits) { rep.ok = false; rep.notes.push('NOT FOUND: ' + E.find.slice(0, 60)); }
          else rep.notes.push(`replaced in ${hits} field(s): ${E.find.slice(0, 50)}`);
        }
      }
      if (P.redraw) {
        const R = P.redraw;
        const hr = R.hr != null ? R.hr : !!before._hr;
        const sets = setn === 'back' ? { x: arr } : plan.bench[code];
        const others = [];
        if (setn !== 'back') { sets.chk.forEach((o, k) => { if (!(setn === 'chk' && k === i)) others.push(o); }); (sets[setn] || []).forEach((o, k) => { if (setn !== 'chk' && k !== i) others.push(o); }); }
        others.push(before);
        const req = (R.require || []).map(x => new RegExp(x)), forb = (R.forbid || []).map(x => new RegExp(x, 'i'));
        const excl = new Set(R.excludeGen || []);
        // generator mix: no repeat within the slot's own set; no generator in all three of chk, re, cmp
        const gk = o => (o._hr ? 'h' : 'r') + o._genIdx;
        const setGenKeys = {};
        if (setn !== 'back') ['chk', 're', 'cmp'].forEach(sn => { setGenKeys[sn] = new Set(sets[sn].filter((o, k) => !(sn === setn && k === i)).map(gk)); });
        const mixPenalty = c => {
          if (setn === 'back') return { p: 0, why: [] };
          const k = gk(c), why = []; let pnl = 0;
          if (setGenKeys[setn].has(k)) { pnl += 6; why.push('generator repeats within the set'); }
          const otherSets = ['chk', 're', 'cmp'].filter(sn => sn !== setn);
          if (otherSets.every(sn => setGenKeys[sn].has(k))) { pnl += 4; why.push('generator would be in all three sets'); }
          return { p: pnl, why };
        };
        let best = null, bestS = Infinity, bestWhy = [];
        for (let t = 0; t < (R.tries || 120); t++) {
          const c = buildProblem(code, hr, new Set(), 14); if (!c) continue;
          if (excl.has(c._genIdx)) continue;
          const pq = qOf(c);
          if (!req.every(r => r.test(pq))) continue;
          if (forb.some(r => r.test(pq + ' ' + ptxt(c.a)))) continue;
          const ov = overlap(c, others), mp = mixPenalty(c);
          const sc = ov.score + mp.p;
          if (sc < bestS) { best = c; bestS = sc; bestWhy = [...ov.why, ...mp.why]; }
          if (bestS === 0) break;
        }
        if (!best) { rep.ok = false; rep.notes.push('NO CANDIDATE PASSED'); }
        else { arr[i] = clone(best); rep.notes.push(`overlap score ${bestS}${bestWhy.length ? ' (' + bestWhy.join('; ') + ')' : ''}`); }
      }
      rep.before = { gen: before._genIdx, q: ptxt(before.q).slice(0, 400), a: ptxt(before.a).slice(0, 300), opts: (before.opts || []).map(ptxt) };
      const af = arr[i];
      rep.after = { gen: af._genIdx, hr: af._hr, rt: af.rt || 'sa', q: ptxt(af.q).slice(0, 900), a: ptxt(af.a).slice(0, 400), s: ptxt(af.s || '').slice(0, 900), opts: (af.opts || []).map(ptxt), ft: af.ft || '' };
      report.push(rep);
    }

    // ---------- rendering ----------
    const LT = 'ABCDEFGH';
    const opts = q => q.rt === 'ms' && Array.isArray(q.opts) ? `${q.inst ? `<div class="rt-inst">${q.inst}</div>` : ''}<div class="opts">${q.opts.map((o, i) => `<div class="opt"><span class="ol">${LT[i]}. &#9744;</span><span class="ot">${fmtFrac(String(o))}</span></div>`).join('')}</div>` : optsHTML(q);
    const item = (q, i) => `<div class="it"><div class="qt"><b>${i + 1}.</b> ${fmtQ(q.q)}</div>${figHTML(q)}${opts(q)}</div>`;
    const ruleFor = q => {
      const has = /1 point/i.test(String(q.a || '') + String(q.s || ''));
      if (has) return '';
      if (q.rt === 'ms') return '<div class="st rule">Scoring: 1 point only if every correct box is checked and no other box is; anything else earns 0.</div>';
      if (q.rt === 'match') return '<div class="st rule">Scoring: 1 point only if every match is correct; anything else earns 0.</div>';
      return '';
    };
    const keyItem = (q, i) => `<div class="ki"><div><b>${i + 1}.</b> <span class="tag">${q._hr ? 'Rigor' : 'Regular'}</span> <span class="an">${fmtAns(q.a)}</span></div>${q.s ? `<div class="st">${fmtFrac(String(q.s).replace(/\n/g, '<br>'))}</div>` : ''}${ruleFor(q)}</div>`;
    const scaleBlock = (code) => {
      const sc = S.scales[code];
      return `<div class="scale"><div class="goal"><b>Learning goal:</b> ${esc(sc.goal)} <span class="dim">(circle your level after scoring)</span></div>
      <table class="sc"><tr><td class="n">4</td><td>${esc(sc.l4)}</td></tr><tr><td class="n">3</td><td>${esc(sc.l3)}</td></tr><tr><td class="n">2</td><td>${esc(sc.l2)}</td></tr><tr><td class="n">1</td><td>I need help to start this benchmark.</td></tr></table></div>`;
    };
    const sheet = (id, code, label, meta, items, withScale, calc) => {
      const hd = (cont) => `<div class="hd"><span class="t">7th Grade Math &middot; ${label}${cont ? ' (continued)' : ''}</span><span class="id">${esc(id)}</span></div>
      <div class="meta"><span>${meta}</span><span>${cont ? 'Student code: ________' : 'Student code: ________ &nbsp; Calculator: ' + calc}</span></div>`;
      return `<div class="page sheet front" data-sheet="${esc(id)}">${hd(false)}${withScale ? scaleBlock(code) : ''}<div class="items fill">${items.map(item).join('')}</div><div class="turn">Turn over &rarr;</div></div>
      <div class="page sheet back" data-sheet="${esc(id)}">${hd(true)}<div class="items fill"></div>
      <div class="ft">Score: ____ / ${items.length} &nbsp;&nbsp;&nbsp; My level: &nbsp;1 &nbsp; 2 &nbsp; 3 &nbsp; 4 &nbsp;&nbsp;&nbsp; &rarr; copy both to your progress strip</div></div>`;
    };
    const half = (id, code, label, items, calc) => `<div class="half">
      <div class="hd"><span class="t">7th Grade Math &middot; ${label}</span><span class="id">${esc(id)}</span></div>
      <div class="meta"><span>Benchmark: <b>${esc(code)}</b> &middot; ${esc(STD[code].l)}</span><span>Student code: ________ &nbsp; Calculator: ${calc}</span></div>
      <div class="items">${items.map(item).join('')}</div>
      <div class="ft">Score: ____ / ${items.length} &nbsp;&nbsp;&nbsp; &rarr; copy to your progress strip</div></div>`;

    let out = '';
    out += `<div class="page cover"><h1>DPP 2026-27 &mdash; 7th Grade Math Weekly Checks</h1>
      <p><b>Read this page first.</b> Everything for the year is in this one file. Nothing here needs to be written before it is copied; the only blanks are the ones students or teachers fill in by hand during the week.</p>
      <h3>What is in this file</h3>
      <table class="idx"><tr><th>Part</th><th>What it is</th><th>Who writes on it</th><th>Where</th></tr>
      <tr><td><b>Index</b></td><td>Every benchmark in unit order with its check ID and page number</td><td>Nobody</td><td>Next page</td></tr>
      <tr><td><b>Scale library</b></td><td>All 34 learning goals and 4-level scales, for the board</td><td>Nobody</td><td>After the index</td></tr>
      <tr><td><b>Weekly check</b> (one per benchmark)</td><td>One sheet per student, front and back: learning goal, scale, 5 items, score box on the back. Always starts on an odd page, so copy two pages two-sided.</td><td>Students, on Thursday</td><td>See index</td></tr>
      <tr><td><b>Answer key</b></td><td>Answers and worked solutions for the check, re-check and comparison items</td><td>Nobody. Read it aloud for peer scoring</td><td>Page after each check</td></tr>
      <tr><td><b>Reteach plan</b></td><td>One-page planner for Tuesday's reteach; fill in Monday</td><td>Croix (copy for John)</td><td>Page after each key</td></tr>
      <tr><td><b>Re-check half</b> (-R)</td><td>3 items on the benchmark that was retaught; two copies per page (one per page when the items are long)</td><td>Students, on Wednesday</td><td>After each reteach plan</td></tr>
      <tr><td><b>Comparison half</b> (-X)</td><td>2 items on a benchmark that was taught but not retaught; two copies per page</td><td>Students, on Wednesday, with the -R half</td><td>After each -R page</td></tr>
      <tr><td><b>Backstop checks</b> (Q2, Q3, Q4)</td><td>Mixed review check for a week when no new check is ready</td><td>Students</td><td>Back of the file, before the forms</td></tr>
      <tr><td><b>Tally sheet</b></td><td>One per teacher per week: 25 scores, trouble item, reteach decision</td><td>Croix and John</td><td>Last 3 pages</td></tr>
      <tr><td><b>Progress strip</b></td><td>One per student per quarter: their scores and levels, kept in the notebook</td><td>Students</td><td>Last 3 pages</td></tr>
      <tr><td><b>Check calendar</b></td><td>Week-by-week list to mark which weeks have a check</td><td>Croix, once</td><td>Last page</td></tr></table>
      <h3>One week, start to finish</h3>
      <ol>
      <li><b>Before Thursday (Croix, ~5 min):</b> look up this week's benchmark in the index. Copy its two check pages two-sided, one per student, for both sections. Copy the key once. Put the key in the binder.</li>
      <li><b>Thursday, last 8 minutes (both):</b> students take the check. They swap papers, you read the key aloud, they score it, circle their level, and copy score and level onto their progress strip. Collect the checks.</li>
      <li><b>Thursday or Friday (both, ~5 min):</b> copy the 25 scores onto a tally sheet. Write the item that gave the most trouble. Put the sheet in the binder.</li>
      <li><b>Monday (Croix, ~5 min):</b> look at both tally sheets, decide what to reteach, write it on the decision line of both sheets. Photograph them and type the numbers into the tracking sheet.</li>
      <li><b>Monday (Croix, ~5 min):</b> copy the -R half for the retaught benchmark and the -X half for the most recent benchmark that was not retaught. One of each per student, both sections.</li>
      <li><b>Tuesday bellwork (both):</b> reteach the trouble item type, 8-10 minutes.</li>
      <li><b>Wednesday bellwork (both):</b> students take the -R and -X halves, peer-score, write the two numbers on their strip. Copy the numbers onto the tally sheet.</li>
      </ol>
      <p>Weeks with a unit test, a break, or only three days: no check. Mark them on the calendar now.</p></div>
      <div class="page"><h1>Index</h1><p>Unit order follows Math Nation Grade 7. The check ID is the benchmark, so it does not matter which week a unit lands.</p>
      <table class="idx"><tr><th>Unit</th><th>Benchmark</th><th>Check ID</th><th>What it covers</th><th>Page</th></tr>`;
    S.order.forEach(([u, t, codes]) => codes.forEach((c, i) => {
      out += `<tr>${i === 0 ? `<td rowspan="${codes.length}"><b>${u}</b> ${esc(t)}</td>` : ''}<td>${c}</td><td>${c.replace('MA.7.', 'C-')}</td><td>${esc(STD[c].l)}</td><td>${PAGES[c.replace('MA.7.', 'C-')] || ''}</td></tr>`;
    }));
    out += `</table></div>`;
    out += `<div class="page"><h1>Scale library &mdash; learning goals and performance scales</h1><p>Student language, one per benchmark. Level 3 is the benchmark; level 2 is the foundational skill; level 4 is application. Printed on every check; also usable on the board.</p><table class="lib"><tr><th>Benchmark</th><th>Learning goal</th><th>Level 2</th><th>Level 3</th><th>Level 4</th></tr>`;
    S.order.forEach(([u, t, codes]) => codes.forEach(c => { const s = S.scales[c]; out += `<tr><td><b>${c}</b><br><span class="dim">Unit ${u}</span></td><td>${esc(s.goal)}</td><td>${esc(s.l2)}</td><td>${esc(s.l3)}</td><td>${esc(s.l4)}</td></tr>`; }));
    out += `</table></div>`;
    out += `<div class="page cover"><h1>Thursday routine &mdash; peer scoring in 3 minutes</h1>
      <p>Same words every week so it runs itself by November.</p>
      <ol>
      <li><b>"Pencils down. Pass your paper to your scoring partner."</b> Partners are fixed (seat neighbor). Scorer writes their own code small in the top corner.</li>
      <li><b>Read the key aloud, item by item.</b> "Number 1, B." For a short-answer item read the answer and the one thing that must be present ("18&pi; centimeters; the &pi; has to be there"). Scorer marks a check or an X next to each item. No partial credit: a select-all item is right only if every box is right.</li>
      <li><b>"Write the score out of 5 in the box. Pass it back."</b></li>
      <li><b>Owner circles their level on the scale</b> and copies score and level onto their progress strip. (Level is theirs to judge; it is not a grade.)</li>
      <li><b>Collect.</b> Checks go in the period folder. Copy the 25 numbers onto the tally sheet when you have five minutes; write the item that gave the most trouble.</li>
      </ol>
      <h3>Rules that keep the data clean</h3>
      <ul style="font-size:9.5px;line-height:1.5"><li>Spot-check five papers a week against the key. If a class can't be trusted to score, score that section yourself for a month.</li>
      <li>Absent = A on the tally sheet, never 0.</li><li>The score is never a grade. Classwork points are for doing the check and filling in the strip.</li>
      <li>Wednesday's re-check runs the same way, with the -R and -X halves scored as two numbers (/3 and /2).</li></ul>
      <h3>Reteach plan page</h3><p>After each answer key there is a one-page reteach planner. Fill it in on Monday when the decision is made; it is the plan for both rooms on Tuesday, and three of them per quarter go in the DPP folder as evidence of the reteach step.</p></div>`;
    const replan = (id, code) => `<div class="page cover replan"><h1>Reteach plan &mdash; ${esc(id)}</h1><p class="dim">${esc(code)} &middot; ${esc(STD[code].l)}</p>
      <div class="rbox" style="height:0.6in"><b>Item that gave the most trouble (from both tally sheets):</b></div>
      <div class="rbox" style="height:0.8in"><b>What the mistake looks like:</b></div>
      <div class="rbox" style="height:2.6in"><b>Worked example for Tuesday (8&ndash;10 min):</b></div>
      <div class="rbox" style="height:2.2in"><b>Three practice items (one change at a time):</b></div>
      <div class="rbox" style="height:0.9in"><b>Decision line:</b> Reteach on ______ &nbsp;&nbsp; Huddle: in person / paper &nbsp;&nbsp; Date: ______ &nbsp;&nbsp; Re-check given on ______</div></div>`;
    S.order.forEach(([u, t, codes]) => codes.forEach(code => {
      const id = code.replace('MA.7.', 'C-');
      const calc = /NSO\.2\.2|NSO\.2\.1|NSO\.1\.1|NSO\.1\.2|AR\.1\./.test(code) ? 'no' : 'yes';
      const { chk, re, cmp } = plan.bench[code];
      out += sheet(id, code, `Weekly Check &middot; Unit ${u}`, `Benchmark: <b>${esc(code)}</b> &middot; ${esc(STD[code].l)}`, chk, true, calc);
      out += `<div class="page key"><h2>Answer key &mdash; ${id} &middot; ${esc(code)} &middot; ${esc(STD[code].l)}</h2><div class="dim">Unit ${u}: ${esc(t)}. Regular = on-benchmark item; Rigor = the item that needs the benchmark's reasoning. Mastery on the weekly check = 4 of 5.</div>
        <h3>Weekly check (5 items)</h3>${chk.map(keyItem).join('')}
        <h3>Re-check strip (3 items, ${id}-R)</h3>${re.map(keyItem).join('')}
        <h3>Comparison strip (2 items, ${id}-X) &mdash; used on a later week's re-check when this benchmark was <i>not</i> retaught</h3>${cmp.map(keyItem).join('')}</div>`;
      out += replan(id, code);
      out += `<div class="page two">${half(id + '-R', code, 'Re-check (3 items)', re, calc)}<div class="cut"></div>${half(id + '-R', code, 'Re-check (3 items)', re, calc)}</div>`;
      out += `<div class="page two">${half(id + '-X', code, 'Comparison items (2)', cmp, calc)}<div class="cut"></div>${half(id + '-X', code, 'Comparison items (2)', cmp, calc)}</div>`;
    }));
    BACKSTOPS.forEach(([q, span]) => {
      const id = `BACKSTOP-${q}`; const items = plan.back[q];
      out += sheet(id, null, `Cumulative Check (${esc(span)})`, 'Mixed benchmarks from earlier units', items, false, 'yes');
      out += `<div class="page key"><h2>Answer key &mdash; ${id}</h2><div class="dim">Given when no new check is ready by Thursday. Logged as a real check (Backstop = y in CHECKS).</div>${items.map((it, i) => keyItem(it, i).replace('</b>', `</b> <span class="tag">${it.standard}</span>`)).join('')}</div>`;
      out += `<div class="page cover"><p class="dim">(blank: keeps the next check on a front page for two-sided copying)</p></div>`;
    });

    const dump = [];
    S.order.forEach(([u, t, codes]) => codes.forEach(code => { const B = plan.bench[code]; [...B.chk, ...B.re, ...B.cmp].forEach(q => dump.push({ code, hr: !!q._hr, gen: q._genIdx, rt: q.rt || '', q: ptxt(q.q), a: ptxt(q.a || ''), opts: q.opts ? q.opts.map(ptxt) : null, ft: q.ft || '' })); }));
    BACKSTOPS.forEach(([q]) => plan.back[q].forEach(x => dump.push({ code: x.standard, hr: !!x._hr, gen: x._genIdx, rt: x.rt || '', q: ptxt(x.q), a: ptxt(x.a || ''), opts: x.opts ? x.opts.map(ptxt) : null, ft: x.ft || '' })));
    return { html: out, plan, report, dump };
  }, { S, BACKSTOPS, PAGES, FROZEN, PATCHES });

  fs.writeFileSync('plan_out.json', JSON.stringify(result.plan));
  fs.writeFileSync('patch_report.json', JSON.stringify(result.report, null, 1));
  fs.writeFileSync('items_dump.json', JSON.stringify(result.dump, null, 1));
  const failed = result.report.filter(r => !r.ok);
  if (failed.length) console.log('PATCH FAILURES', JSON.stringify(failed.map(f => [f.slot, f.notes])));

  const css = `
  body > *:not(#dpp){display:none !important}
  #dpp{display:block;width:7.8in;margin:0;font-size:12.5px;font-family:Lexend,Arial,Helvetica,sans-serif;color:#111;background:#fff;--paper:Lexend;--figf:Lexend}
  #dpp svg text{font-family:Lexend,Arial,sans-serif}
  #dpp .opt,#dpp .ot,#dpp .ol,#dpp .rt-inst,#dpp .ftab,#dpp .mtab{font-size:1em}#dpp .opt .katex{font-size:1.04em}
  #dpp .opt .ol{white-space:nowrap;flex:none;width:auto;min-width:2.2em}
  @page{size:letter;margin:0.35in}
  .page{page-break-after:always;box-sizing:border-box;height:10.3in;overflow:hidden;position:relative}
  .page:last-child{page-break-after:auto}
  .page.two{display:flex;flex-direction:column}
  .page.two.single{height:10.2in}.half > .items{flex:1 1 0;display:flex;flex-direction:column;min-height:0}.half > .items > .it{flex:1 1 auto;min-height:0;overflow:hidden}
  .half{flex:1 1 0;box-sizing:border-box;padding:0 2px 4px 2px;overflow:hidden;display:flex;flex-direction:column;min-height:0}
  .half .figwrap{width:var(--figw,2.8in);max-width:100%}.half .it svg{max-height:none;max-width:100%}
  .page.sheet{display:flex;flex-direction:column;height:10.2in;overflow:hidden}
  .page.sheet .items.fill{flex:1 1 0;display:flex;flex-direction:column;min-height:0}
  .page.sheet .items.fill .it{flex:1 1 auto;min-height:0;overflow:hidden}
  .page.sheet .figwrap{width:var(--figw,3.4in);max-width:100%}.page.sheet .it svg{max-height:none;max-width:100%}
  .page.sheet .ft{margin-top:8px;font-size:10.5px}
  .page.sheet .turn{text-align:right;font-size:9px;color:#666;margin-top:6px}
  .cut{border-top:1px dashed #888;margin:6px 0}
  .half > *{flex:none}
  .hd{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.5px solid #222;padding-bottom:2px}
  .hd .t{font-weight:700;font-size:1.25em}.hd .id{font-weight:700;font-size:1.15em;letter-spacing:.04em}
  .meta{display:flex;justify-content:space-between;font-size:.86em;margin:4px 0 6px;line-height:1.4}
  .scale{border:1px solid #333;padding:5px 7px;margin-bottom:8px;font-size:.86em}
  .scale .goal{margin-bottom:2px}.dim{color:#666}
  table.sc{border-collapse:collapse;width:100%;margin-top:3px}table.sc td{border-top:1px solid #ccc;padding:2px 6px;line-height:1.3}
  table.sc td.n{width:16px;font-weight:700;text-align:center;border-right:1px solid #ccc}
  .items{display:block}
  .it{border:1px solid #333;margin-top:-1px;padding:6px 8px 8px;font-size:1em;line-height:1.45}
  .it .qt b{margin-right:4px}.it .opts{display:grid;grid-template-columns:1fr 1fr;gap:3px 14px;margin:6px 0 0 18px}.it .opt{display:flex;gap:4px}
  .it table.ftab{font-size:.9em;margin:3px 0}
  .ft{font-size:.9em;font-weight:700;margin-top:6px}
  .page.key h2{font-size:14px;margin:0 0 2px}.page.key h3{font-size:11px;margin:10px 0 3px;border-bottom:1px solid #999}
  .page.key .ki{font-size:.95em;padding:4px 0;border-bottom:1px dotted #ccc;line-height:1.4}
  .page.key .an{font-weight:700;color:#111 !important}.page.key .an *{color:#111 !important}.page.key .st{color:#444;font-size:.86em;margin-left:18px}.page.key .st.rule{font-style:italic;color:#222}
  .tag{font-size:8px;border:1px solid #999;padding:0 3px;margin-right:4px;color:#444}
  .page.cover h1,.page h1{font-size:18px;margin:0 0 6px}.page.cover p{font-size:10px;line-height:1.5}.rbox{border:1px solid #333;padding:5px 8px;margin-bottom:8px;font-size:10px}.page.cover ul{padding-left:18px}.page.cover h3{font-size:12px;margin:12px 0 4px}.page.cover ol{font-size:9.5px;line-height:1.5;padding-left:18px;margin:0}.page.cover li{margin-bottom:3px}
  table.idx,table.lib{border-collapse:collapse;width:100%;font-size:.68em;line-height:1.35}
  table.idx td,table.idx th,table.lib td,table.lib th{border:1px solid #999;padding:2px 5px;vertical-align:top;text-align:left}
  table.idx th,table.lib th{background:#222;color:#fff}
  table.lib td{font-size:.88em;line-height:1.3}
  .katex{font-size:1em}
  `;
  await p.evaluate(({ html, css }) => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'dpp'; d.innerHTML = html; document.body.appendChild(d);
    document.body.classList.remove('inking');
  }, { html: result.html, css });
  await p.emulateMedia({ media: 'print' });
  await p.waitForTimeout(500);
  // Checks: split across front/back so the two pages are as even as possible; shrink figures first, then type.
  await p.evaluate(() => {
    const RESERVE = 72;   // write-in items keep at least 0.75 in of blank space on a weekly check
    const isWriteIn = it => !it.querySelector('.opts, .mtab');
    // leftover space goes mostly to items where students write, not to multiple-choice items
    document.querySelectorAll('.page .it').forEach(it => { it.style.flexGrow = isWriteIn(it) ? '4' : '1'; });
    document.querySelectorAll('.page.sheet.front').forEach(front => {
      const back = front.nextElementSibling;
      const fi = front.querySelector('.items'), bi = back.querySelector('.items');
      const all = [...fi.children, ...bi.children];
      const natural = () => { fi.classList.remove('fill'); bi.classList.remove('fill'); all.forEach(e => { e.style.minHeight = '0'; }); };
      const fill = () => { fi.classList.add('fill'); bi.classList.add('fill'); all.forEach(e => { e.style.minHeight = ''; }); };
      const fixedF = () => [...front.children].filter(e => !e.classList.contains('items')).reduce((a, e) => a + e.offsetHeight, 0);
      const fixedB = () => [...back.children].filter(e => !e.classList.contains('items')).reduce((a, e) => a + e.offsetHeight, 0);
      const avail = front.clientHeight;
      let fitWithReserve = false, hn = [];
      for (let step = 0; step < 8; step++) {
        natural();
        all.forEach(e => fi.appendChild(e));
        hn = all.map(e => e.offsetHeight);
        const h = all.map((e, k) => hn[k] + (isWriteIn(e) ? RESERVE : 0));
        const fF = fixedF(), fB = fixedB();
        let bestK = 1, bestMax = Infinity;
        for (let k = 1; k < all.length; k++) {
          const f = fF + h.slice(0, k).reduce((a, x) => a + x, 0), bb = fB + h.slice(k).reduce((a, x) => a + x, 0);
          const m = Math.max(f, bb); if (m < bestMax) { bestMax = m; bestK = k; }
        }
        all.slice(bestK).forEach(e => bi.appendChild(e));
        if (bestMax <= avail - 10) { fitWithReserve = true; break; }
        const figw = [3.0, 2.6, 2.2, 1.9, 1.9, 1.9, 1.9, 1.9][step], font = [100, 100, 100, 100, 92, 84, 76, 76][step];
        [front, back].forEach(pg => { pg.style.fontSize = font + '%'; pg.style.setProperty('--figw', figw + 'in'); });
      }
      fill();
      if (fitWithReserve) all.forEach((e, k) => { e.style.minHeight = (hn[k] + (isWriteIn(e) ? RESERVE - 4 : 0)) + 'px'; });
    });
  });
  // Half pages: two copies at readable size if they fit; otherwise one copy per page with full-size figures.
  await p.evaluate(m => { window.__MINW = m; }, process.env.MINW || '50');
  const layout = await p.evaluate(() => {
    const bad = [], singles = [];
    const over = pg => pg.scrollHeight > pg.clientHeight + 2 || [...pg.querySelectorAll('.half,.it')].some(e => e.scrollHeight > e.clientHeight + 2);
    const pageOver = pg => pg.scrollHeight > pg.clientHeight + 2;
    const writeIn = it => !it.querySelector('.opts, .mtab');
    const blank = it => it.clientHeight - ([...it.children].reduce((a, c) => a + c.offsetHeight, 0) + 16);
    const MINW = +(window.__MINW || 50); const cramped = pg => [...pg.querySelectorAll('.it')].some(it => writeIn(it) && blank(it) < MINW);
    document.querySelectorAll('.page.two').forEach(pg => {
      const id = (pg.querySelector('.id') || {}).textContent;
      let ok = false;
      for (const [f, w, mh] of [[100, '2.8in', '1.0in'], [100, '2.4in', '0.8in'], [92, '2.1in', '0']]) {
        pg.style.fontSize = f + '%'; pg.style.setProperty('--figw', w);
        pg.querySelectorAll('.it').forEach(e => e.style.minHeight = mh);
        if (!over(pg) && !cramped(pg)) { ok = true; break; }
      }
      if (!ok) {
        pg.classList.add('single'); const hs = pg.querySelectorAll('.half'); if (hs.length > 1) hs[1].remove(); const c = pg.querySelector('.cut'); if (c) c.remove();
        pg.querySelectorAll('.it').forEach(e => e.style.minHeight = '');
        const steps = [[100, '3.2in'], [100, '2.8in'], [100, '2.4in'], [92, '2.1in'], [84, '2.0in'], [76, '1.8in']];
        let chosen = null;
        for (const [f, w] of steps) { pg.style.fontSize = f + '%'; pg.style.setProperty('--figw', w); if (!over(pg) && !cramped(pg)) { chosen = [f, w]; break; } }
        if (!chosen) for (const [f, w] of steps) { pg.style.fontSize = f + '%'; pg.style.setProperty('--figw', w); if (!over(pg)) break; }
        singles.push(id);
        if (over(pg)) bad.push(['single', id]);
      }
    });
    document.querySelectorAll('.page:not(.two):not(.sheet)').forEach(pg => {
      let tries = 0;
      while (pageOver(pg) && tries < 6) { pg.style.fontSize = (100 - 8 * (tries + 1)) + '%'; tries++; }
      if (pageOver(pg)) bad.push(['page', (pg.querySelector('h1,h2') || {}).textContent]);
    });
    document.querySelectorAll('.page.sheet').forEach(pg => { if (pageOver(pg) || [...pg.querySelectorAll('.it')].some(e => e.scrollHeight > e.clientHeight + 2)) bad.push(['sheet', pg.dataset.sheet]); });
    let minLabel = 99, minWhere = '';
    document.querySelectorAll('.half svg').forEach(svg => {
      const vb = svg.viewBox && svg.viewBox.baseVal; if (!vb || !vb.width) return;
      const scale = svg.getBoundingClientRect().width / vb.width;
      svg.querySelectorAll('text').forEach(t => { const fs = parseFloat(t.style.fontSize || t.getAttribute('font-size') || '11'); const pt = fs * scale * 0.75; if (pt < minLabel) { minLabel = pt; minWhere = (svg.closest('.half').querySelector('.id') || {}).textContent; } });
    });
    // smallest writing box on any student page, in inches
    let minBox = 99, minBoxWhere = '';
    document.querySelectorAll('.page.two .it, .page.sheet .it').forEach(it => { const h = it.getBoundingClientRect().height / 96; if (h < minBox) { minBox = h; minBoxWhere = (it.closest('.page').querySelector('.id') || {}).textContent; } });
    let minBlank = 99, minBlankWhere = '';
    document.querySelectorAll('.page.two .it, .page.sheet .it').forEach(it => { if (!writeIn(it)) return; const b = blank(it) / 96; if (b < minBlank) { minBlank = b; minBlankWhere = (it.closest('.page').querySelector('.id') || {}).textContent; } });
    const sheetBlank = [...document.querySelectorAll('.page.sheet .it')].filter(writeIn).map(it => blank(it) / 96);
    const under = sheetBlank.filter(b => b < 0.6).length;
    const tight = [...document.querySelectorAll('.page.sheet .it, .page.two .it')].filter(writeIn).map(it => [(it.closest('.page').querySelector('.id') || {}).textContent, (it.querySelector('.qt b') || {}).textContent, Math.round(blank(it) / 96 * 100) / 100]).filter(x => x[2] < 0.6);
    return { tight, sheetWriteIns: sheetBlank.length, sheetUnder06: under, bad, nSingles: singles.length, singles, minLabel: Math.round(minLabel * 10) / 10, minWhere, minBox: Math.round(minBox * 100) / 100, minBoxWhere, minWriteIn: Math.round(minBlank * 100) / 100, minWriteInWhere: minBlankWhere };
  });
  console.log('LAYOUT', JSON.stringify(layout));
  await p.pdf({ path: 'DPP_Check_Bank_v1.pdf', format: 'Letter', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="width:100%;text-align:right;font-size:7px;font-family:Arial;color:#777;padding-right:0.35in">DPP Check Bank &middot; p. <span class="pageNumber"></span></div>', margin: { top: '0.35in', bottom: '0.45in', left: '0.35in', right: '0.35in' } });
  await b.close();
  console.log('done');
})();
