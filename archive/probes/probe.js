const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  p.on('console', m => { if (m.type()==='error') console.log('ERR', m.text().slice(0,200)); });
  await p.goto('file:///home/claude/dpp/cadence.html');
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => {
    const out = {};
    out.mode = typeof MODE !== 'undefined' ? MODE : null;
    out.modes = [...document.querySelectorAll('[data-mode],#modeSeg button')].map(e=>e.textContent.trim()).slice(0,12);
    out.qC = document.getElementById('qC') ? [...document.getElementById('qC').options].map(o=>o.value) : null;
    out.selectedType = typeof SELECTED;
    out.stdOn = Object.keys(STD).filter(k=>STD[k].g===7 && STD[k].co.includes('on'));
    out.hasBank = out.stdOn.map(k=>[k, getBank(k,false).length, getBank(k,true).length]);
    return out;
  });
  console.log(JSON.stringify(info, null, 1));
  await b.close();
})();
