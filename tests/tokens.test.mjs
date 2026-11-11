import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, cp, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const source = JSON.parse(await read('src/tokens/foundations.json'));
const declarations = source.web.primitive[0].declarations;
const semantic = source.web.semantic[0].declarations;
for (const block of source.web.themes.filter(block => block.declarations['color-scheme'])) {
  const available = { ...declarations, ...block.declarations, ...semantic };
  for (const value of Object.values(semantic)) {
    for (const [, reference] of value.matchAll(/var\((--[\w-]+)\)/g)) {
      assert.ok(reference in available, `Unresolved ${reference} in ${block.selector}`);
    }
  }
}

// Prove edits to the source propagate to all three platforms, including unit conversion.
const sandbox = await mkdtemp(join(tmpdir(), 'nds-tokens-'));
try {
  await mkdir(join(sandbox, 'scripts'), { recursive: true });
  await mkdir(join(sandbox, 'src/tokens'), { recursive: true });
  await cp(new URL('scripts/generate-tokens.mjs', root), join(sandbox, 'scripts/generate-tokens.mjs'));
  declarations['--nds-space-2'] = '0.625rem';
  declarations['--nds-radius-pill'] = '999px';
  source.web.themes[0].declarations['--nds-color-canvas'] = '#123456';
  await writeFile(join(sandbox, 'src/tokens/foundations.json'), JSON.stringify(source));
  const run = (...args) => execFileSync(process.execPath, [join(sandbox, 'scripts/generate-tokens.mjs'), ...args], { stdio: 'pipe' });
  run();
  const swift = await readFile(join(sandbox, 'native/ios/NikbaTokens.swift'), 'utf8');
  const kotlin = await readFile(join(sandbox, 'native/android/NikbaTokens.kt'), 'utf8');
  assert.match(swift, /case \.frost: 0x123456/);
  assert.match(kotlin, /canvas = Color\(0xff123456\)/);
  assert.match(await readFile(join(sandbox, 'src/tokens/themes.css'), 'utf8'), /--nds-color-canvas: #123456;/);
  assert.match(swift, /let s2: CGFloat = 10\b/);
  assert.match(kotlin, /val s2 = 10\.dp/);
  assert.match(swift, /let pill: CGFloat = 999\b/);
  assert.match(kotlin, /val pill = 999\.dp/);
  assert.doesNotMatch(swift, /clamp\(/);
  run('--check');
  await writeFile(join(sandbox, 'native/ios/NikbaTokens.swift'), '// stale');
  assert.throws(() => run('--check'), /Stale tokens/);
  const consumer = join(sandbox, 'consumer');
  await mkdir(consumer);
  run('--ios-output', consumer, '--android-output', consumer);
  assert.equal(await readFile(join(consumer, 'NikbaTokens.swift'), 'utf8'), swift);
  assert.equal(await readFile(join(consumer, 'NikbaTokens.kt'), 'utf8'), kotlin);
  run('--check', '--ios-output', consumer, '--android-output', consumer);
  // Consumer sync must carry handwritten components together with their generated tokens.
  await cp(new URL('scripts/sync-native.mjs', root), join(sandbox, 'scripts/sync-native.mjs'));
  for (const [platform, extension] of [['ios', 'swift'], ['android', 'kt']]) {
    await cp(new URL(`native/${platform}/NikbaComponents.${extension}`, root), join(sandbox, `native/${platform}/NikbaComponents.${extension}`));
  }
  const sync = (...args) => execFileSync(process.execPath, [join(sandbox, 'scripts/sync-native.mjs'), ...args], { stdio: 'pipe' });
  sync('--ios-output', consumer, '--android-output', consumer);
  assert.equal(await readFile(join(consumer, 'NikbaComponents.swift'), 'utf8'), await read('native/ios/NikbaComponents.swift'));
  assert.equal(await readFile(join(consumer, 'NikbaComponents.kt'), 'utf8'), await read('native/android/NikbaComponents.kt'));
  sync('--check', '--ios-output', consumer, '--android-output', consumer);
  await writeFile(join(consumer, 'NikbaComponents.swift'), '// stale component');
  assert.throws(() => sync('--check', '--ios-output', consumer), /Outdated native source/);
  assert.throws(() => sync('--ios-output', consumer, '--android-output', join(sandbox, 'missing')), /ENOENT/);
  assert.equal(await readFile(join(consumer, 'NikbaComponents.swift'), 'utf8'), '// stale component', 'Invalid destinations must fail before writing any consumer files.');
} finally {
  await rm(sandbox, { recursive: true, force: true });
}
console.log('Token references, cross-platform propagation, unit conversion, drift detection and consumer sync passed.');
