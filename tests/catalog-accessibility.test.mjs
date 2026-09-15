import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { componentCatalog } from '../playground/component-catalog.js';

const playground = new URL('../playground/', import.meta.url);
const componentDirectory = new URL('components/', playground);
const componentFiles = (await readdir(componentDirectory)).filter((file) => file.endsWith('.html'));
const files = ['index.html', 'foundations.html', 'mcp.html', ...componentFiles.map((file) => `components/${file}`)];

for (const file of files) {
  const html = await readFile(new URL(file, playground), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.match(html, /<html\s[^>]*lang="en"/, `${file}: document language is required.`);
  assert.match(html, /<main\s[^>]*id="main"/, `${file}: main landmark is required.`);
  assert.match(html, /class="skip-link"[^>]*href="#main"/, `${file}: skip link is required.`);
  assert.match(html, /<footer class="catalog-footer nds-container">[\s\S]*?Designed and built with all the love in the world by the[\s\S]*?<a class="nds-link" href="https:\/\/nikba\.com\/">Nikba Creative Studio<\/a>\.[\s\S]*?Alpha 02 · Product ready[\s\S]*?<\/footer>/, `${file}: shared responsive Footer content is required.`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${file}: exactly one h1 is required.`);
  assert.deepEqual(duplicateIds, [], `${file}: duplicate IDs: ${duplicateIds.join(', ')}.`);
  for (const image of html.match(/<img\b[^>]*>/g) ?? []) assert.match(image, /\salt="[^"]*"/, `${file}: images require alt attributes.`);
  for (const dialog of html.match(/<dialog\b[^>]*>/g) ?? []) assert.match(dialog, /aria-label(?:ledby)?="[^"]+"/, `${file}: Dialog requires an accessible name.`);
}

assert.equal(componentCatalog.length, componentFiles.length - 1, 'Every component reference page requires catalog metadata.');
for (const [index, component] of componentCatalog.entries()) {
  const next = componentCatalog[(index + 1) % componentCatalog.length];
  const html = await readFile(new URL(`${component.slug}.html`, componentDirectory), 'utf8');
  assert.match(html, /<section[^>]*class="guidance-panel[^>]*>[\s\S]*?<a class="nds-link[^>]*>Next (?:component|pattern): /, `${component.slug}.html: guidance requires a Next link.`);
  assert.ok(html.includes(`href="/components/${next.slug}.html"`), `${component.slug}.html: Next must point to ${next.slug}.html.`);
}

console.log(`Catalog accessibility structure passed for ${files.length} pages.`);
