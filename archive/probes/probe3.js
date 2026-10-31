const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  await p.goto('file:///home/claude/dpp/cadence.html'); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => { const u=new Set(); const q=buildProblem('MA.7.DP.2.1',false,u,14); return {rt:q.rt, opts:q.opts, html: optsHTML(q)}; });
  console.log(JSON.stringify(r,null,1)); await b.close();
})();
