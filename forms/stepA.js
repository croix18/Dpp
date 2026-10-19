// Forms edition, step A: frozen edition 4.1 + Forms patches -> plan_forms.json (items) and stepA_report.json.
// Patches: edit (find/replace in a field), set (replace fields), fig (build a new figure with Cadence's own
// figure helpers), redraw (constrained redraw of one slot, scored on overlap and generator mix, and
// required to be gradable by Google Forms), forms (overrides for the Forms answer spec, passed through).
const { chromium } = require('playwright');
const fs = require('fs');
const ROOT = '/home/claude/dpp/';
const FROZEN = JSON.parse(fs.readFileSync(ROOT + 'frozen_ed4_1.json', 'utf8'));
const PATCHES = JSON.parse(fs.readFileSync(ROOT + 'forms/forms_patches.json', 'utf8'));

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text().slice(0, 200)); });
  await p.addInitScript(() => { let a = 20261026 >>> 0; Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; });
  await p.goto('file://' + ROOT + 'cadence.html');
  await p.waitForTimeout(1500);

  const result = await p.evaluate(({ FROZEN, PATCHES }) => {
    const clone = o => JSON.parse(JSON.stringify(o));
    const ptxt = s => plain(String(s == null ? '' : s));
    const plan = clone(FROZEN);

    // ---- overlap scoring, same rules as build_bank2.js ----
    const CONST = new Set(['3.14', '2.2', '2.54', '3.785', '1.609', '0.62', '1.61', '28.35', '0.454', '2.205', '60', '100', '1000', '360', '12', '24', '10', '22/7']);
    const toks = t => { const out = []; String(t).replace(/−/g, '-').replace(/(\d+(?:,\d{3})*(?:\.\d+)?)(?:\s*\/\s*(\d+))?/g, (m, a, d) => { a = a.replace(/,/g, ''); const raw = d ? a + '/' + d : a; const v = d ? (+a) / (+d) : +a; out.push({ raw, v: Math.round(v * 1e6) / 1e6 }); return m; }); return out; };
    const strongV = tk => !CONST.has(tk.raw) && !([0.5, 0.25, 0.75, 1.5, 2.5].includes(tk.v)) && (Math.abs(tk.v - Math.round(tk.v)) > 1e-9 ? true : tk.v >= 13);
    const qOf = o => ptxt(o.q) + ' ' + (o.opts || []).map(ptxt).join(' ') + ' ' + (o.rows || []).map(ptxt).join(' ');
    const tmplOf = o => ptxt(o.q).replace(/\b[A-Z][a-z]+\b/g, 'NAME').toLowerCase().replace(/[\d.,−\-\/]+/g, '#').slice(0, 60);
    const overlap = (cand, others) => {
      const cq = toks(qOf(cand)), ca = toks(ptxt(cand.a)); let score = 0; const why = [];
      for (const o of others) {
        const oq = toks(qOf(o)), oa = toks(ptxt(o.a));
        const oqv = new Set(oq.filter(strongV).map(t => t.v)), oav = new Set(oa.filter(strongV).map(t => t.v));
        const sq = [...new Set(cq.filter(strongV).map(t => t.v))].filter(v => oqv.has(v));
        if (sq.length) { score += 3 * sq.length; why.push('givens ' + sq.join(',')); }
        const x1 = [...new Set(ca.filter(strongV).map(t => t.v))].filter(v => oqv.has(v) || oav.has(v));
        const x2 = [...new Set(oa.filter(strongV).map(t => t.v))].filter(v => cq.some(t => t.v === v));
        if (x1.length || x2.length) { score += 5 * (x1.length + x2.length); why.push('answer/given ' + [...x1, ...x2].join(',')); }
        const shAll = [...new Set(cq.map(t => t.v))].filter(v => oq.some(t => t.v === v)); const shBig = shAll.filter(v => v >= 3);
        if (shBig.length >= 2) { score += 2 * (shBig.length - 1); why.push('numbers ' + shBig.join(',')); }
        if (tmplOf(cand) === tmplOf(o) && shAll.length >= 2) { score += 4; why.push('same template, shared ' + shAll.join(',')); }
        const a1 = ptxt(cand.a).replace(/^[A-H]\.\s*/, '').trim(), a2 = ptxt(o.a).replace(/^[A-H]\.\s*/, '').trim();
        if (a1.length > 2 && a1 === a2) { score += 2; why.push('same answer'); }
      }
      return { score, why };
    };
    // Forms can grade: choices, or one number / fraction / mixed number (units, $, %, "about" stripped)
    const gradable = c => {
      if (['mc', 'ms', 'etc'].includes(c.rt)) return true;
      if (c.rt) return false;
      let a = ptxt(c.a).trim();
      if (/Score:|;|\{|graph|line/i.test(a)) return false;
      a = a.replace(/\s*\((?:or )?[^()]*\)\s*$/, '').replace(/^(about|approximately)\s+/i, '').replace(/^[a-z]\s*=\s*(?=[−\-$\d])/, '');
      return /^[−\-]?\$?(\d+(\.\d+)?|\d+\/\d+|\d+ \d+\/\d+)(π)?(\s*(%|°[CF]?|[a-zA-Z][a-zA-Z .²³]*))?$/.test(a) || /^[−\-]?\$?\d+(\.\d+)?%$/.test(a);
    };

    // ---- figure builders (Cadence's own helpers) ----
    const inner = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    const vb = svg => { const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg); return [+m[1], +m[2]]; };
    const BUILD = {
      grid4: F => {
        const panels = F.lines.map(ln => { const g = figGrid(Object.assign({ size: 170 }, F.grid)); return g.svgOpen + figLine(g, ln.m, ln.b) + g.svgClose; });
        const [w, h] = vb(panels[0]); const GAP = 26, LBL = 22;
        const labels = F.labels || panels.map((_, i) => 'Graph ' + LTR[i]);
        let body = '';
        panels.forEach((s, i) => {
          // two per row; a lone panel in the last row is centered
          const row = Math.floor(i / 2), lone = panels.length % 2 === 1 && i === panels.length - 1;
          const ox = lone ? (w + GAP) / 2 : (i % 2) * (w + GAP), oy = row * (h + LBL + GAP);
          body += ftxt(ox + w / 2, oy + 15, labels[i], { size: 13, weight: 700 });
          body += `<g transform="translate(${fn2(ox)} ${fn2(oy + LBL)})">${inner(s)}</g>`;
        });
        const rows = Math.ceil(panels.length / 2), W = 2 * w + GAP, H = rows * (h + LBL) + (rows - 1) * GAP;
        return { fig: `<svg class="fig quad" width="100%" viewBox="0 0 ${fn2(W)} ${fn2(H)}" preserveAspectRatio="xMidYMid meet">${body}</svg>`,
          ft: `${panels.length} graphs (${labels.join(', ')}) on the same grid (${F.grid.xlabel} from ${F.grid.xmin} to ${F.grid.xmax} by ${F.grid.xstep || 1}, ${F.grid.ylabel} from ${F.grid.ymin} to ${F.grid.ymax} by ${F.grid.ystep}): ` +
            F.lines.map((ln, i) => `${labels[i]} is the line y = ${+ln.m.toFixed(4)}x${ln.b ? ' + ' + ln.b : ''}`).join('; ') };
      },
      numline4: F => {
        const figs = F.lines.map(L => figNumberLine({ min: F.min, max: F.max, step: 1, size: 330, points: [{ x: L.x, open: L.open }], shade: { from: L.x, dir: L.dir } }));
        const [w, h] = vb(figs[0]); const LW = 34, GAP = 6;
        let body = '';
        figs.forEach((f, i) => { const oy = i * (h + GAP);
          body += ftxt(12, oy + h / 2 + 5, LTR[i], { size: 15, weight: 700 });
          body += `<g transform="translate(${LW} ${fn2(oy)})">${inner(f)}</g>`; });
        return { fig: `<svg class="fig nl4" width="100%" viewBox="0 0 ${fn2(w + LW)} ${fn2(4 * h + 3 * GAP)}" preserveAspectRatio="xMidYMid meet">${body}</svg>`,
          ft: 'four number lines labeled A through D: ' + F.lines.map((L, i) => `${LTR[i]}: ${L.open ? 'open' : 'closed'} circle at ${L.x}, shaded ${L.dir}`).join('; ') };
      },
      gridPoint: F => {
        const g = figGrid(Object.assign({ size: 220 }, F.grid));
        return { fig: g.svgOpen + figLine(g, F.m, F.b) + figPoints(g, F.points, { labels: true }).replace(/<text /g, '<text stroke="#fff" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke" ') + g.svgClose,
          ft: `a line through the origin with slope ${F.m} on a grid with x from ${F.grid.xmin} to ${F.grid.xmax} by ${F.grid.xstep} and y from ${F.grid.ymin} to ${F.grid.ymax} by ${F.grid.ystep}; marked: ${F.points.map(q => `(${q[0]}, ${q[1]})`).join(', ')}` };
      },
    };

    const report = [], forms = {};
    for (const P of PATCHES) {
      const [code, setn, idx] = P.slot.split('/'); const i = +idx;
      const arr = plan.bench[code][setn]; const before = clone(arr[i]);
      const rep = { slot: P.slot, why: P.why, kind: P.redraw ? 'redraw' : P.set ? 'replace' : P.edit ? 'edit' : 'forms', ok: true, notes: [] };
      if (P.edit) for (const E of P.edit) {
        const v = arr[i][E.field];
        if (typeof v === 'string' && v.includes(E.find)) { arr[i][E.field] = v.split(E.find).join(E.replace); rep.notes.push('edited ' + E.field); }
        else { rep.ok = false; rep.notes.push('NOT FOUND: ' + E.find.slice(0, 60)); }
      }
      if (P.set) for (const [k, v] of Object.entries(P.set)) { if (v === null) delete arr[i][k]; else arr[i][k] = v; }
      if (P.fig) { const r = BUILD[P.fig.builder](P.fig); arr[i].fig = r.fig; arr[i].ft = r.ft; rep.notes.push('figure ' + P.fig.builder); }
      if (P.redraw) {
        const R = P.redraw, hr = !!before._hr, sets = plan.bench[code];
        const others = []; sets.chk.forEach((o, k) => { if (!(setn === 'chk' && k === i)) others.push(o); });
        if (setn !== 'chk') sets[setn].forEach((o, k) => { if (k !== i) others.push(o); });
        others.push(before);
        const excl = new Set(R.excludeGen || []);
        const gk = o => (o._hr ? 'h' : 'r') + o._genIdx;
        const setGenKeys = {}; ['chk', 're', 'cmp'].forEach(sn => { setGenKeys[sn] = new Set(sets[sn].filter((o, k) => !(sn === setn && k === i)).map(gk)); });
        const mix = c => { const k = gk(c), why = []; let pn = 0;
          if (setGenKeys[setn].has(k)) { pn += 6; why.push('generator repeats within the set'); }
          if (['chk', 're', 'cmp'].filter(sn => sn !== setn).every(sn => setGenKeys[sn].has(k))) { pn += 4; why.push('generator in all three sets'); }
          return { p: pn, why }; };
        let best = null, bestS = Infinity, bestWhy = [], seen = 0;
        for (let t = 0; t < 400; t++) {
          const c = buildProblem(code, hr, new Set(), 14); if (!c || excl.has(c._genIdx)) continue;
          if (R.gradable && !gradable(c)) continue;
          if ((R.require || []).some(x => !new RegExp(x).test(qOf(c)))) continue;
          seen++;
          const ov = overlap(c, others), mp = mix(c), sc = ov.score + mp.p;
          if (sc < bestS) { best = c; bestS = sc; bestWhy = [...ov.why, ...mp.why]; }
          if (bestS === 0 && seen > 20) break;
        }
        if (!best) { rep.ok = false; rep.notes.push('NO CANDIDATE PASSED'); }
        else { arr[i] = clone(best); rep.notes.push(`gen ${best._genIdx}, overlap+mix score ${bestS}${bestWhy.length ? ' (' + bestWhy.join('; ') + ')' : ''}, from ${seen} candidates`); }
      }
      // fields written after a redraw (e.g. a clearer worked solution); 'expect' guards that the redraw is the item it was written for
      if (P.expect && !(ptxt(arr[i].q).includes(P.expect.q) && ptxt(arr[i].a) === P.expect.a)) { rep.ok = false; rep.notes.push('REDRAW CHANGED: the after-fields were written for a different item'); }
      else if (P.after) for (const [k, v] of Object.entries(P.after)) arr[i][k] = v;
      if (P.forms) forms[P.slot] = P.forms;
      rep.before = { gen: before._genIdx, rt: before.rt || 'sa', q: ptxt(before.q).slice(0, 500), a: ptxt(before.a).slice(0, 300) };
      const af = arr[i];
      rep.after = { gen: af._genIdx, rt: af.rt || 'sa', q: ptxt(af.q).slice(0, 900), a: ptxt(af.a).slice(0, 400), opts: (af.opts || []).map(ptxt), s: ptxt(af.s || '').slice(0, 900), ft: af.ft || '' };
      report.push(rep);
    }
    // every item must now be gradable by Forms (or carry a Forms override)
    const bad = [];
    Object.entries(plan.bench).forEach(([code, B]) => ['chk', 're', 'cmp'].forEach(sn => B[sn].forEach((o, k) => { const slot = `${code}/${sn}/${k}`; if (!forms[slot] && !gradable(o)) bad.push(slot + ' :: ' + ptxt(o.a).slice(0, 80)); })));
    return { plan: { bench: plan.bench }, report, forms, bad };
  }, { FROZEN, PATCHES });

  fs.writeFileSync(ROOT + 'forms/plan_forms.json', JSON.stringify(result.plan));
  fs.writeFileSync(ROOT + 'forms/forms_overrides.json', JSON.stringify(result.forms, null, 1));
  fs.writeFileSync(ROOT + 'forms/stepA_report.json', JSON.stringify(result.report, null, 1));
  const failed = result.report.filter(r => !r.ok);
  console.log('patches', result.report.length, 'failed', failed.length);
  failed.forEach(f => console.log('  FAIL', f.slot, f.notes.join(' | ')));
  result.report.filter(r => r.kind === 'redraw').forEach(r => console.log('  REDRAW', r.slot, r.notes.join(' | '), '\n     ', r.after.q.slice(0, 200), '=>', r.after.a));
  console.log('not gradable:', result.bad.length); result.bad.forEach(x => console.log('  ', x));
  await b.close();
})();
