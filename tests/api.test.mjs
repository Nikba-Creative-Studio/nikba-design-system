import assert from 'node:assert/strict';
import {
  createToastManager,
  glassLevels,
  initAccordions,
  initDialogs,
  initForms,
  initNavigations,
  initPopovers,
  initTooltips,
  initTabs,
  initTables,
  observeComponents,
  setGlassLevel,
  setTheme,
  themes,
} from '../dist/nikba-design-system.js';

const target = { dataset: {} };

assert.equal(typeof createToastManager, 'function');

assert.deepEqual(themes, ['frost', 'mist', 'graphite']);
assert.deepEqual(glassLevels, ['off', 'soft', 'clear']);
assert.equal(typeof initAccordions, 'function');
assert.equal(typeof initDialogs, 'function');
assert.equal(typeof initForms, 'function');
assert.equal(typeof initNavigations, 'function');
assert.equal(typeof initPopovers, 'function');
assert.equal(typeof initTooltips, 'function');
assert.equal(typeof initTabs, 'function');
assert.equal(typeof initTables, 'function');
assert.equal(typeof observeComponents, 'function');

for (const theme of themes) {
  setTheme(theme, target);
  assert.equal(target.dataset.theme, theme);
}

for (const level of glassLevels) {
  setGlassLevel(level, target);
  assert.equal(target.dataset.glass, level);
}

assert.throws(() => setTheme('unknown', target), TypeError);
assert.throws(() => setGlassLevel('unknown', target), TypeError);

console.log('Public theme and glass APIs passed.');
