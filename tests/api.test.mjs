import assert from 'node:assert/strict';
import {
  createToastManager,
  glassLevels,
  initAccordions,
  initDialogs,
  initNavigations,
  initPopovers,
  initTooltips,
  initTabs,
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
assert.equal(typeof initNavigations, 'function');
assert.equal(typeof initPopovers, 'function');
assert.equal(typeof initTooltips, 'function');
assert.equal(typeof initTabs, 'function');

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
