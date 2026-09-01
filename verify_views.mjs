import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/a/.gemini/antigravity-cli/brain/0e392d22-25b1-4ed4-87b6-664cfb4efc06/playwright_screens';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { name: '01_ocean_home', path: 'http://localhost:3001/' },
  { name: '02_vibe_workspace', path: 'http://localhost:3001/vibe' },
  { name: '03_work_kanban', path: 'http://localhost:3001/work' },
  { name: '04_mint_staking', path: 'http://localhost:3001/mint' },
  { name: '05_pricing_plans', path: 'http://localhost:3001/pricing' },
  { name: '06_video_studio', path: 'http://localhost:3001/video' },
  { name: '07_music_daw', path: 'http://localhost:3001/music' },
  { name: '08_3d_editor', path: 'http://localhost:3001/3d' },
  { name: '09_login_zoo_id', path: 'http://localhost:3001/login' }
];

async function run() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome' // or default chromium
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  for (const r of routes) {
    const page = await context.newPage();
    try {
      await page.goto(r.path, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(1000);
      const filePath = path.join(outDir, `${r.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✓ Captured ${r.name} -> ${filePath}`);
    } catch (err) {
      console.error(`Error capturing ${r.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

run();
