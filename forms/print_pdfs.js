// Prints the build-sheet and start-page HTML files (forms/build_html/jobs.json) to PDF with Chromium.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const jobs = JSON.parse(fs.readFileSync('/home/claude/dpp/forms/build_html/jobs.json', 'utf8'));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  let n = 0;
  for (const j of jobs) {
    fs.mkdirSync(path.dirname(j.pdf), { recursive: true });
    await p.goto('file://' + j.html);
    await p.waitForLoadState('load');
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: j.pdf, format: 'Letter', printBackground: true, margin: { top: '0.45in', bottom: '0.45in', left: '0.5in', right: '0.5in' } });
    n++;
  }
  console.log('pdfs', n);
  await b.close();
})();
