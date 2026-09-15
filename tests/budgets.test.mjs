import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const css = await readFile(new URL('../dist/nikba-design-system.css', import.meta.url));
const javascript = await readFile(new URL('../dist/nikba-design-system.js', import.meta.url));
const kibibyte = 1024;
const sizes = {
  cssGzip: gzipSync(css, { level: 9 }).byteLength,
  javascriptGzip: gzipSync(javascript, { level: 9 }).byteLength,
  combinedRaw: css.byteLength + javascript.byteLength,
};

assert.ok(sizes.cssGzip <= 20 * kibibyte, `CSS gzip budget exceeded: ${sizes.cssGzip} bytes.`);
assert.ok(sizes.javascriptGzip <= 12 * kibibyte, `JavaScript gzip budget exceeded: ${sizes.javascriptGzip} bytes.`);
assert.ok(sizes.combinedRaw <= 140 * kibibyte, `Combined raw budget exceeded: ${sizes.combinedRaw} bytes.`);

console.log(`Bundle budgets passed: CSS ${sizes.cssGzip} B gzip, JavaScript ${sizes.javascriptGzip} B gzip, ${sizes.combinedRaw} B raw.`);
