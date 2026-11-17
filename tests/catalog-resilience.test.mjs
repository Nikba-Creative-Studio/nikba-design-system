import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Exercise the shipped HTML/CSS, including the experience when the module never runs.
const origin = process.env.CATALOG_TEST_URL || 'http://127.0.0.1:4177';
const server = process.env.CATALOG_TEST_URL ? null : spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--config', 'vite.playground.config.js', '--host', '127.0.0.1', '--port', '4177', '--strictPort'], { stdio: 'ignore' });
let browser;
try {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await fetch(origin).then(r => r.ok).catch(() => false)) break;
    if (attempt === 79) throw new Error('Catalog preview did not start. Run npm run build first.');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : chromium.executablePath()) });
  const routes = ['/', '/foundations.html', '/mcp.html', '/components/', ...(await readdir(new URL('../playground/components/', import.meta.url))).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => `/components/${f}`)];
  const widths = [320, 375, 390, 414, 768, 1024, 1280, 1920];
  const rows = [];
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${origin}${route}`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const result = await page.evaluate(() => {
        const outside = [...document.querySelectorAll('main a, main button, main input, main textarea, main select')].filter(e => {
          const r = e.getBoundingClientRect();
          if (!r.width || !r.height || e.closest('dialog:not([open]), [hidden]')) return false;
          // Scrollable code, tables and reference sidebars intentionally have their own viewport.
          for (let ancestor = e.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
            if (['auto', 'scroll'].includes(getComputedStyle(ancestor).overflowX) && ancestor.scrollWidth > ancestor.clientWidth) return false;
          }
          return r.left < -1 || r.right > innerWidth + 1;
        }).map(e => e.textContent.trim().slice(0, 60) || e.getAttribute('aria-label') || e.tagName);
        return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, outside };
      });
      assert.ok(result.scrollWidth <= width + 1, `${route} at ${width}: document overflow`);
      assert.deepEqual(result.outside, [], `${route} at ${width}: controls clipped by page bounds`);
      if (route === '/foundations.html' && width === 390) {
        assert.equal(await page.locator('.layout-demo > div').evaluateAll(elements => elements.every(e => e.scrollWidth <= e.clientWidth)), true, 'Layout specimen labels fit their phone cells');
      }
      rows.push({ route, ...result });
    }
  }
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const plain = await noScript.newPage();
  for (const route of routes) {
    await plain.goto(`${origin}${route}`);
    assert.equal(await plain.locator('nav[aria-label="Primary navigation"] a').count(), 5, `${route}: static navigation`);
    assert.equal(await plain.locator('.catalog-nav [aria-current="page"]').count(), 1, `${route}: current destination`);
    for (const element of await plain.locator('.reveal').all()) assert.equal(await element.evaluate(e => getComputedStyle(e).opacity), '1', `${route}: no-script content hidden`);
    assert.notEqual(await plain.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), 'rgba(0, 0, 0, 0)', `${route}: stylesheet depends on JS`);
  }
  await noScript.close();
  await page.setViewportSize({width:390,height:844});
  await page.goto(origin);
  assert.equal(await page.locator('.appearance-disclosure').getAttribute('open'), null, 'Mobile appearance starts collapsed');
  await page.locator('.appearance-disclosure > summary').click();
  for (const theme of ['graphite','mist','frost']) {
    await page.locator(`[data-theme-controls] [data-value="${theme}"]`).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
  }
  for (const level of ['off','clear','soft']) {
    await page.locator(`[data-glass-controls] [data-value="${level}"]`).click();
    assert.equal(await page.locator('html').getAttribute('data-glass'),level);
  }
  await page.locator('.appearance-disclosure > summary').click();
  for (const link of await page.locator('[data-native-download]').all()) {
    const response=await page.request.get(new URL(await link.getAttribute('href'), origin).href);
    assert.equal(response.status(),200,'Native download resolves');
    const name=await link.getAttribute('download');
    assert.ok((await response.body()).length>100,`${name}: nonempty source`);
    if(name.endsWith('.json')) assert.equal(JSON.parse(await response.text()).schemaVersion, 1);
    else assert.match(await response.text(), /\bNDS(?:Colors|Button)\b/, `${name}: actual native source rather than an HTML fallback`);
  }
  await page.setViewportSize({width:1280,height:800});
  await page.goto(origin);
  for (const selector of ['.hero h1','.hero__footer p','.hero__footer .nds-button']) {
    const box=await page.locator(selector).first().boundingBox();
    assert.ok(box.y>=0 && box.y+box.height<=800,`${selector}: hero action above fold`);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload();
  assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0,'Reduced motion disables animations');
  await page.keyboard.press('Tab');
  assert.ok(await page.locator('.skip-link').evaluate(e=>e===document.activeElement && parseFloat(getComputedStyle(e).outlineWidth)>0),'Skip link has instant keyboard focus');
  await mkdir(new URL('../artifacts/hallmark/',import.meta.url),{recursive:true});
  await writeFile(new URL('../artifacts/hallmark/resilience.json',import.meta.url),JSON.stringify({routes:routes.length,widths,checks:rows.length,noScriptPages:routes.length,rows},null,2));
  console.log(`Catalog resilience passed: ${routes.length} routes × ${widths.length} widths; no-script navigation, mobile appearance, native downloads, fold, reduced motion and keyboard focus.`);
} finally {
  await browser?.close();
  server?.kill();
}
