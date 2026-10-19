const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  p.on('console', m => console.log('CONSOLE', m.type(), m.text().slice(0,200)));
  await p.goto('file:///home/claude/dpp/cadence.html'); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const res={reg:getBank('MA.7.DP.1.4',false).length, hr:getBank('MA.7.DP.1.4',true).length, tries:[]};
    for(let k=0;k<5;k++){ try{ const q=buildProblem('MA.7.DP.1.4',false,new Set(),14); res.tries.push(q?plain(q.q).slice(0,50):null);}catch(e){res.tries.push('ERR '+e.message.slice(0,120));} }
    for(let k=0;k<3;k++){ try{ const q=buildProblem('MA.7.DP.1.4',true,new Set(),14); res.tries.push('HR '+(q?plain(q.q).slice(0,50):null));}catch(e){res.tries.push('HR ERR '+e.message.slice(0,120));} }
    return res;
  });
  console.log(JSON.stringify(r,null,1)); await b.close();
})();
