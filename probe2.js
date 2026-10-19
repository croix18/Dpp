const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  p.on('console', m => { if (m.type()==='error') console.log('ERR', m.text().slice(0,200)); });
  await p.goto('file:///home/claude/dpp/cadence.html');
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const fns = ['setMode','pickMode','selectStd','toggleStd','setCourse','pickCourse','setRetake'].filter(f=>typeof window[f]==='function');
    SELECTED.clear(); SELECTED.add('MA.7.GR.1.3');
    document.getElementById('qC').value='5';
    gen();
    const paper = document.querySelector('.paper');
    const sample = PROBLEMS.map(p=>({keys:Object.keys(p), q:String(p.q).slice(0,160), a:String(p.a||'').slice(0,80), hasFig: !!(p.fig||p.svg||p.figure)}));
    return {fns, mode: MODE, n: PROBLEMS.length, sample, html: paper ? paper.outerHTML.slice(0,3000) : null, cls: paper?paper.className:null};
  });
  console.log(JSON.stringify(r, null, 1));
  await p.screenshot({path:'shot.png', fullPage:false});
  await b.close();
})();
