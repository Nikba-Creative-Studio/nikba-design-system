import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pixelGrid, readPng } from './helpers/png-grid.mjs';

const repository = new URL('..', import.meta.url).pathname;
const output = join(repository, 'artifacts/browser');
const port = 4174;
const chrome = process.env.CHROME_PATH
  ?? (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome');
const pages = [
  ['overview', '/'],
  ['form', '/components/form-validation.html#demo'],
  ['confirmation', '/components/destructive-confirmation.html#demo'],
];
const viewports = [[1280, 900], [390, 844]];
const baselines = JSON.parse(await readFile(join(repository, 'tests/visual-baselines.json'), 'utf8'));

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let error = '';
    child.stderr.on('data', (chunk) => { error += chunk; });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(error || `${command} exited with ${code}`)));
  });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, [join(repository, 'node_modules/vite/bin/vite.js'), 'preview', '--config', join(repository, 'vite.playground.config.js'), '--host', '127.0.0.1', '--port', String(port)], { cwd: repository, stdio: 'ignore' });

try {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) break; } catch { /* Preview is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  for (const [name, path] of pages) {
    for (const [width, height] of viewports) {
      const destination = join(output, `${name}-${width}x${height}.png`);
      await run(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--no-sandbox', `--window-size=${width},${height}`, `--screenshot=${destination}`, `http://127.0.0.1:${port}${path}`]);
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
  server.kill('SIGTERM');
}
