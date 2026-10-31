const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage();
  await p.goto('file:///home/claude/dpp/cadence.html'); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const codes = Object.keys(STD).filter(k=>STD[k].g===7 && STD[k].co.includes('on'));
    const res = {total:0, mismatch:[], badJSON:[], keys:new Set()};
    for (const code of codes) for (const hr of [false,true]) for (let k=0;k<6;k++) {
      const q = buildProblem(code, hr, new Set(), 14); if (!q) continue; res.total++;
      Object.keys(q).forEach(x=>res.keys.add(x+':'+typeof q[x]));
      let c; try { c = JSON.parse(JSON.stringify(q)); } catch(e) { res.badJSON.push(code); continue; }
      const h1 = fmtQ(q.q)+figHTML(q)+optsHTML(q)+fmtAns(q.a)+(q.s?fmtFrac(String(q.s)):'');
      const h2 = fmtQ(c.q)+figHTML(c)+optsHTML(c)+fmtAns(c.a)+(c.s?fmtFrac(String(c.s)):'');
      if (h1 !== h2) res.mismatch.push([code, hr, h1.length, h2.length]);
    }
    res.keys=[...res.keys].sort(); return res;
  });
  console.log(JSON.stringify(r,null,1)); await b.close();
})();
