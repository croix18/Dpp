const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage();
  await p.goto('file:///home/claude/dpp/cadence.html'); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => { const q=buildProblem('MA.7.AR.4.3',false,new Set(),14); return figHTML(q).slice(0,600); });
  console.log(r); await b.close();
})();
