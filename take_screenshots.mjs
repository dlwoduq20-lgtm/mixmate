import puppeteer from 'puppeteer-core';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\dlwod\\OneDrive\\바탕 화면\\칵테일앱';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 1080 x 1920 (9:16 portrait standard for mobile store screenshots)
  await page.setViewport({
    width: 412,
    height: 732,
    deviceScaleFactor: 2.621359, // Exactly results in 1080 x 1919 / 1920 px
    isMobile: true,
    hasTouch: true
  });

  console.log('Navigating to Home...');
  await page.goto('https://dlwoduq20-lgtm.github.io/mixmate/#/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500)); // Wait for splash screen fadeout
  await page.screenshot({ path: path.join(outDir, 'screenshot_1_home.png') });
  console.log('Screenshot 1 captured!');

  console.log('Navigating to Discovery...');
  await page.goto('https://dlwoduq20-lgtm.github.io/mixmate/#/discovery', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'screenshot_2_discovery.png') });
  console.log('Screenshot 2 captured!');

  console.log('Navigating to Detail...');
  await page.goto('https://dlwoduq20-lgtm.github.io/mixmate/#/cocktail/mojito', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'screenshot_3_detail.png') });
  console.log('Screenshot 3 captured!');

  console.log('Navigating to My Bar...');
  await page.goto('https://dlwoduq20-lgtm.github.io/mixmate/#/my-bar', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'screenshot_4_mybar.png') });
  console.log('Screenshot 4 captured!');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(console.error);
