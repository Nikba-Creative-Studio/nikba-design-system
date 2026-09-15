import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const playground = new URL('../playground/', import.meta.url);
const componentDirectory = new URL('components/', playground);
const files = ['index.html', 'foundations.html', 'mcp.html', ...(await readdir(componentDirectory)).filter((file) => file.endsWith('.html')).map((file) => `components/${file}`)];

for (const file of files) {
  const html = await readFile(new URL(file, playground), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.match(html, /<html\s[^>]*lang="en"/, `${file}: document language is required.`);
  assert.match(html, /<main\s[^>]*id="main"/, `${file}: main landmark is required.`);
  assert.match(html, /class="skip-link"[^>]*href="#main"/, `${file}: skip link is required.`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${file}: exactly one h1 is required.`);
  assert.deepEqual(duplicateIds, [], `${file}: duplicate IDs: ${duplicateIds.join(', ')}.`);
  for (const image of html.match(/<img\b[^>]*>/g) ?? []) assert.match(image, /\salt="[^"]*"/, `${file}: images require alt attributes.`);
  for (const dialog of html.match(/<dialog\b[^>]*>/g) ?? []) assert.match(dialog, /aria-label(?:ledby)?="[^"]+"/, `${file}: Dialog requires an accessible name.`);
}

console.log(`Catalog accessibility structure passed for ${files.length} pages.`);
