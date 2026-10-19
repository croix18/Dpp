const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  await p.goto('file:///home/claude/dpp/cadence.html'); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const out = {reg: getBank('MA.7.GR.1.1', false).length, hr: getBank('MA.7.GR.1.1', true).length, samples: []};
    for (let g = 0; g < out.reg; g++) { const s = new Set(); for (let k = 0; k < 12; k++) { const bank = getBank('MA.7.GR.1.1', false); const q = sanitizeProblem(bank[g]()); s.add(plain(q.q).slice(0, 70)); } out.samples.push([g, [...s].slice(0, 4)]); }
    return out;
  });
  console.log(JSON.stringify(r, null, 1)); await b.close();
})();
