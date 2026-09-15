import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const example = new URL('../examples/blade/', import.meta.url);
const css = await readFile(new URL('resources/css/app.css', example), 'utf8');
const javascript = await readFile(new URL('resources/js/app.js', example), 'utf8');
const button = await readFile(new URL('resources/views/components/nds-button.blade.php', example), 'utf8');
const dialog = await readFile(new URL('resources/views/components/nds-dialog.blade.php', example), 'utf8');
const account = await readFile(new URL('resources/views/account.blade.php', example), 'utf8');

assert.match(css, /@import '@nikba\/design-system\/css'/);
assert.match(javascript, /from '@nikba\/design-system'/);
assert.match(button, /\$attributes->class/);
assert.match(button, /match \(\$variant\)/);
assert.match(dialog, /data-nds-dialog/);
assert.match(dialog, /aria-labelledby/);
assert.match(account, /data-nds-dialog-open="delete-account-dialog"/);
assert.doesNotMatch([css, javascript, button, dialog, account].join('\n'), /(?:\.\.\/)+src\//);

console.log('Blade integration example contract passed.');
