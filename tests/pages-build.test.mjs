import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const output = new URL('../dist-playground/', import.meta.url);
const base = '/nikba-design-system/';
const duplicatedBase = `${base}${base.slice(1)}`;

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) files.push(...await htmlFiles(new URL(`${entry.name}/`, directory)));
    else if (entry.name.endsWith('.html')) files.push(url);
  }
  return files;
}

const files = await htmlFiles(output);
assert.equal(files.length, 32, 'GitHub Pages build includes every catalog page.');

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rootLinks = [...html.matchAll(/\b(?:href|action)=["'](\/[^/][^"']*)/g)].map((match) => match[1]);
  assert.ok(rootLinks.length > 0, `${file.pathname}: expected catalog links.`);
  for (const link of rootLinks) {
    assert.ok(link.startsWith(base), `${file.pathname}: ${link} escapes the GitHub Pages base.`);
    assert.ok(!link.startsWith(duplicatedBase), `${file.pathname}: ${link} duplicates the GitHub Pages base.`);
  }
}

const assets = await readdir(new URL('assets/', output));
const appBundle = assets.find((file) => /^app-.*\.js$/.test(file));
assert.ok(appBundle, 'GitHub Pages build includes the catalog JavaScript bundle.');
assert.match(await readFile(new URL(`assets/${appBundle}`, output), 'utf8'), /\/nikba-design-system\//, 'Runtime navigation includes the GitHub Pages base.');

console.log(`GitHub Pages build contract passed for ${files.length} pages.`);
