import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { pixelGrid, readPng } from './helpers/png-grid.mjs';

const repository = new URL('..', import.meta.url).pathname;
const output = join(repository, 'artifacts/browser');
const port = 4174;
const chrome = process.env.CHROME_PATH
  ?? (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : chromium.executablePath());
const pages = [
  ['overview', '/'],
  ['form', '/components/form-validation.html#demo'],
  ['confirmation', '/components/destructive-confirmation.html#demo'],
];
const viewports = [[1280, 900], [390, 844]];
const baselines = JSON.parse(await readFile(join(repository, 'tests/visual-baselines.json'), 'utf8'));
const snapshotFont = (await readFile(join(repository, 'tests/helpers/onest-latin.woff2.base64'), 'utf8')).trim();

function connectCdp(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const pending = new Map();
    const eventWaiters = new Map();
    let nextId = 0;

    socket.addEventListener('error', reject, { once: true });
    socket.addEventListener('open', () => resolve({
      close: () => socket.close(),
      send(method, params = {}) {
        const id = ++nextId;
        socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolveCommand, rejectCommand) => pending.set(id, { resolve: resolveCommand, reject: rejectCommand }));
      },
      waitFor(method) {
        return new Promise((resolveEvent) => {
          const waiters = eventWaiters.get(method) ?? [];
          waiters.push(resolveEvent);
          eventWaiters.set(method, waiters);
        });
      },
    }), { once: true });
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        const command = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) command?.reject(new Error(message.error.message));
        else command?.resolve(message.result);
        return;
      }
      const waiters = eventWaiters.get(message.method);
      waiters?.shift()?.(message.params);
    });
  });
}

function availablePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function waitForDebugServer(port, child) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Chrome exited before exposing its debugging server (code ${child.exitCode}).`);
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) return; } catch { /* Chrome is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Chromium did not expose its debugging server within 30 seconds.');
}

function stop(child) {
  if (child.exitCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    child.once('exit', resolve);
    child.kill('SIGTERM');
  });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, [join(repository, 'node_modules/vite/bin/vite.js'), 'preview', '--config', join(repository, 'vite.playground.config.js'), '--host', '127.0.0.1', '--port', String(port)], { cwd: repository, stdio: 'ignore' });
const profile = await mkdtemp(join(tmpdir(), 'nds-browser-'));
const debugPort = await availablePort();
const browser = spawn(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--no-sandbox', '--remote-debugging-address=127.0.0.1', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
let cdp;

try {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) break; } catch { /* Preview is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await waitForDebugServer(debugPort, browser);
  const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
  const pageTarget = targets.find((target) => target.type === 'page');
  assert.ok(pageTarget?.webSocketDebuggerUrl, 'Chrome requires a debuggable page target.');
  cdp = await connectCdp(pageTarget.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Network.setBlockedURLs', { urls: ['*://fonts.googleapis.com/*', '*://fonts.gstatic.com/*'] });

  for (const [name, path] of pages) {
    for (const [width, height] of viewports) {
      const destination = join(output, `${name}-${width}x${height}.png`);
      await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      const pageUrl = new URL(path, `http://127.0.0.1:${port}`);
      pageUrl.searchParams.set('snapshot', `${width}x${height}`);
      const loaded = cdp.waitFor('Page.loadEventFired');
      await cdp.send('Page.navigate', { url: pageUrl.href });
      await loaded;
      const fontSource = JSON.stringify(`url(data:font/woff2;base64,${snapshotFont}) format('woff2')`);
      await cdp.send('Runtime.evaluate', { expression: `(async () => { const font = new FontFace('Onest Snapshot', ${fontSource}, { style: 'normal', weight: '100 900' }); await font.load(); document.fonts.add(font); document.documentElement.style.setProperty('--nds-font-sans', "'Onest Snapshot', sans-serif"); await new Promise((resolve) => setTimeout(resolve, 1000)); })()`, awaitPromise: true });
      const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
      await writeFile(destination, Buffer.from(screenshot.data, 'base64'));
    }
  }

  for (const [name] of pages) {
    for (const [width, height] of viewports) {
      const destination = join(output, `${name}-${width}x${height}.png`);
      const png = await readFile(destination);
      assert.equal(png.toString('hex', 1, 4), '504e47', `${destination} is a PNG.`);
      assert.equal(png.readUInt32BE(16), width, `${destination} preserves viewport width.`);
      assert.equal(png.readUInt32BE(20), height, `${destination} preserves viewport height.`);
      assert.ok(png.byteLength > 10_000, `${destination} contains a rendered page.`);
      const baseline = baselines[`${name}-${width}x${height}.png`];
      assert.ok(baseline, `${destination} has an approved baseline.`);
      const currentGrid = pixelGrid(readPng(png), 4, 4);
      const channelDifferences = currentGrid.map((value, index) => Math.abs(value - baseline.grid[index]));
      const meanDifference = channelDifferences.reduce((total, value) => total + value, 0) / channelDifferences.length;
      const changedChannels = channelDifferences.filter((value) => value > 24).length;
      assert.ok(meanDifference <= 10, `${destination} mean visual difference ${meanDifference.toFixed(2)} exceeds 10.`);
      assert.ok(changedChannels <= 6, `${destination} changed ${changedChannels} sampled channels beyond the 24-point threshold.`);
    }
  }
  console.log(`Browser snapshot smoke passed for ${pages.length * viewports.length} viewports.`);
} finally {
  cdp?.close();
  await Promise.all([stop(browser), stop(server)]);
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
