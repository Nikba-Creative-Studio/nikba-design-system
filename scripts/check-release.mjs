import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');
const pkg = JSON.parse(await read('package.json'));
const lock = JSON.parse(await read('package-lock.json'));
assert.equal(lock.version, pkg.version, 'Lockfile version differs from package version.');
assert.equal(lock.packages[''].version, pkg.version, 'Root lockfile package version differs.');
assert.ok((await read('README.md')).includes('Status: `' + pkg.version + '`'), 'README status must identify the package version.');
const changelog = await read('CHANGELOG.md');
assert.ok(changelog.includes('## ' + pkg.version + ' - '), 'Changelog must contain a dated entry for the package version.');
assert.ok(pkg.files.includes('CHANGELOG.md'), 'Published package must include its changelog.');
assert.equal(pkg.publishConfig.access, 'public');
console.log('Release metadata is consistent for ' + pkg.version + '.');
