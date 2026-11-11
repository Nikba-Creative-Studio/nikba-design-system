import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const { values } = parseArgs({ options: {
  'ios-output': { type: 'string' }, 'android-output': { type: 'string' }, check: { type: 'boolean' },
} });
if (!values['ios-output'] && !values['android-output']) throw new Error('Specify --ios-output or --android-output with an existing source directory.');
execFileSync(process.execPath, [resolve(root, 'scripts/generate-tokens.mjs'), '--check'], { stdio: 'inherit' });
const copies = [];
for (const [platform, extension] of [['ios', 'swift'], ['android', 'kt']]) {
  const directory = values[`${platform}-output`];
  if (!directory) continue;
  if (!(await stat(directory)).isDirectory()) throw new Error(`${directory} is not a directory.`);
  for (const name of ['NikbaTokens', 'NikbaComponents']) {
    const filename = `${name}.${extension}`;
    const content = await readFile(resolve(root, 'native', platform, filename), 'utf8');
    const target = resolve(directory, filename);
    if (values.check && await readFile(target, 'utf8') !== content) throw new Error(`Outdated native source: ${target}`);
    copies.push({ target, content });
  }
}
if (!values.check) for (const { target, content } of copies) await writeFile(target, content);
console.log(`${values.check ? 'Checked' : 'Synchronized'} ${copies.length} native source files.`);
