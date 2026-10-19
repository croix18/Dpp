const { chromium } = require('/home/claude/dpp/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  await p.goto('file:///home/claude/dpp/script_kit/build/guide.html');
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: '/home/claude/dpp/script_kit/build/guide.pdf', format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
