const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage();
  await p.goto('file:///home/claude/dpp/cadence.html'); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const codes = Object.keys(STD).filter(k=>STD[k].g===7 && STD[k].co.includes('on')); const out={};
    for (const code of codes) { out[code]={label:STD[code].l, reg:[], hr:[]};
      for (const hr of [false,true]) { const bank=getBank(code,hr);
        for (let g=0; g<bank.length; g++) { const stems=new Set(), rts=new Set(); for (let k=0;k<10;k++){ try{ const q=sanitizeProblem(bank[g]()); stems.add(plain(String(q.q)).replace(/\s+/g,' ').slice(0,110)); rts.add(q.rt||'sa'); }catch(e){ stems.add('ERR '+e.message.slice(0,60)); } }
          out[code][hr?'hr':'reg'].push({gen:g, rt:[...rts].join('/'), samples:[...stems].slice(0,3)}); } } }
    return out; });
  fs.writeFileSync('banks.json', JSON.stringify(r,null,1)); await b.close(); console.log(Object.keys(r).length);
})();
