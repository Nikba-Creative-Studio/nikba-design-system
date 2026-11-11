import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const repository = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = await mkdtemp(join(tmpdir(), 'nds-consumer-'));
const consumer = join(temporary, 'plain');

try {
  const { stdout } = await exec('npm', ['pack', '--json', '--pack-destination', temporary], { cwd: repository });
  const [{ filename }] = JSON.parse(stdout);
  const archive = join(temporary, filename);
  await cp(join(repository, 'examples/plain'), consumer, { recursive: true });
  await writeFile(join(consumer, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
    dependencies: { '@nikba/design-system': `file:${archive}` },
  }, null, 2));
  await exec('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], { cwd: consumer });
  await exec(process.execPath, [join(repository, 'node_modules/vite/bin/vite.js'), 'build', consumer], { cwd: repository });

  const output = join(consumer, 'dist');
  const html = await readFile(join(output, 'index.html'), 'utf8');
  const assets = await readdir(join(output, 'assets'));
  assert.match(html, /assets\/index-[^"']+\.js/);
  assert.ok(assets.some((file) => file.endsWith('.css')), 'Consumer build emits the design-system CSS.');
  assert.ok(assets.some((file) => file.endsWith('.js')), 'Consumer build emits the JavaScript entry.');
  const installed = join(consumer, 'node_modules/@nikba/design-system');
  assert.match(await readFile(join(installed, 'Package.swift'), 'utf8'), /NikbaDesignSystem/);
  assert.match(await readFile(join(installed, 'native/ios/Resources/OFL.txt'), 'utf8'), /SIL OPEN FONT LICENSE/);
  assert.ok((await readFile(join(installed, 'native/ios/Resources/Onest.ttf'))).length > 100_000);
  await exec(process.execPath, [join(repository, 'tests/mcp.test.mjs')], {
    cwd: consumer, env: { ...process.env, NDS_MCP_PACKAGE_ROOT: installed },
  });
  console.log('Packed web consumer, SwiftPM resources and native MCP contracts passed.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
