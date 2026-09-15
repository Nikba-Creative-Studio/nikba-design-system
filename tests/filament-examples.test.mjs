import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const example = new URL('../examples/filament/', import.meta.url);
const provider = await readFile(new URL('app/Providers/AdminPanelProvider.php', example), 'utf8');
const css = await readFile(new URL('resources/css/filament/admin/nikba.css', example), 'utf8');
const view = await readFile(new URL('resources/views/filament/admin/project-context.blade.php', example), 'utf8');

assert.match(provider, /->viteTheme\(/);
assert.match(provider, /LocalFontProvider::class/);
assert.match(provider, /->colors\(/);
assert.match(provider, /->brandLogo\(/);
assert.match(css, /@import '@nikba\/design-system\/css'/);
assert.match(view, /class="nds-scope nds-filament-region"/);
assert.doesNotMatch(css, /\.fi-(?:fo|ta|ac|modal)/, 'Do not restyle Filament component internals.');
assert.doesNotMatch([provider, css, view].join('\n'), /vendor\/filament\/.*resources\/views/);

console.log('Filament integration boundary contract passed.');
