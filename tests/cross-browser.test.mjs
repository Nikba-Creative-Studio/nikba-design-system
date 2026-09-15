import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium, firefox, webkit } from 'playwright';

const repository = new URL('..', import.meta.url).pathname;
const port = 4175;
const baseUrl = `http://127.0.0.1:${port}`;
const engines = { chromium, firefox, webkit };
const requestedEngines = (process.env.NDS_BROWSERS ?? 'chromium,firefox,webkit')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);

function stop(child) {
  if (child.exitCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    child.once('exit', resolve);
    child.kill('SIGTERM');
  });
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      if ((await fetch(baseUrl)).ok) return;
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Catalog preview did not start.');
}

async function assertVisible(locator, message) {
  assert.equal(await locator.isVisible(), true, message);
}

async function verifyEngine(name) {
  const engine = engines[name];
  assert.ok(engine, `Unknown browser engine: ${name}`);
  const launchOptions = {};
  if (name === 'chromium' && process.env.NDS_CHROMIUM_PATH) {
    launchOptions.executablePath = process.env.NDS_CHROMIUM_PATH;
  }

  const browser = await engine.launch(launchOptions);
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.route(/fonts\.googleapis\.com/, (route) => route.fulfill({
    status: 200,
    contentType: 'text/css',
    body: '',
  }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await assertVisible(page.getByRole('heading', { level: 1 }), `${name}: Overview heading is visible.`);
    assert.equal(await page.locator('.catalog-nav__links a').count(), 4, `${name}: all primary destinations render.`);
    await page.locator('[data-theme-controls] [data-value="graphite"]').click();
    await page.locator('[data-glass-controls] [data-value="soft"]').click();
    const glassFilter = await page.locator('.proof.nds-glass').evaluate((element) => {
      const styles = getComputedStyle(element);
      return styles.getPropertyValue('backdrop-filter') || styles.getPropertyValue('-webkit-backdrop-filter');
    });
    assert.match(glassFilter, /blur\(8px\)/, `${name}: Graphite Soft applies its backdrop blur.`);

    await page.setViewportSize({ width: 390, height: 844 });
    for (const link of await page.locator('.catalog-nav__links a').all()) {
      await assertVisible(link, `${name}: primary navigation remains visible on compact screens.`);
    }
    const homeCatalog = page.locator('.page-home .catalog-section');
    await homeCatalog.evaluate((element) => element.scrollIntoView());
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.page-home .catalog-section')).opacity === '1');
    assert.equal(await homeCatalog.evaluate((element) => getComputedStyle(element).opacity), '1', `${name}: the complete mobile catalog is revealed.`);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${baseUrl}/components/tabs.html#automatic`, { waitUntil: 'domcontentloaded' });
    await page.locator('#activity-tab').click();
    assert.equal(await page.locator('#activity-tab').getAttribute('aria-selected'), 'true', `${name}: Tabs update selection.`);
    await assertVisible(page.locator('#activity-panel'), `${name}: Tabs reveal the selected panel.`);

    await page.goto(`${baseUrl}/components/dialog.html#confirmation`, { waitUntil: 'domcontentloaded' });
    const dialogOpener = page.getByRole('button', { name: 'Delete project' }).first();
    await dialogOpener.click();
    assert.equal(await page.locator('#delete-dialog').getAttribute('open'), '', `${name}: Dialog opens.`);
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Keep project', `${name}: Dialog focuses the safe action.`);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#delete-dialog').getAttribute('open'), null, `${name}: Escape closes the Dialog.`);
    assert.equal(await dialogOpener.evaluate((element) => element === document.activeElement), true, `${name}: Dialog restores opener focus.`);

    await page.goto(`${baseUrl}/components/select.html#states`, { waitUntil: 'domcontentloaded' });
    const selectbox = page.locator('#states [data-nds-select]').first();
    await selectbox.locator('[data-nds-select-trigger]').click();
    await selectbox.getByRole('option', { name: 'Editor' }).click();
    assert.equal(await selectbox.locator('[data-nds-select-value]').inputValue(), 'editor', `${name}: Select synchronizes its form value.`);
    assert.equal(await selectbox.locator('[data-nds-select-trigger]').getAttribute('aria-invalid'), 'false', `${name}: Select clears its invalid state.`);

    assert.deepEqual(errors, [], `${name}: pages render without runtime errors.`);
  } finally {
    await context.close();
    await browser.close();
  }
}

const server = spawn(
  process.execPath,
  [`${repository}node_modules/vite/bin/vite.js`, 'preview', '--config', `${repository}vite.playground.config.js`, '--host', '127.0.0.1', '--port', String(port)],
  { cwd: repository, stdio: 'ignore' },
);

try {
  await waitForPreview();
  for (const name of requestedEngines) await verifyEngine(name);
  console.log(`Cross-browser interaction smoke passed in ${requestedEngines.join(', ')}.`);
} finally {
  await stop(server);
}
