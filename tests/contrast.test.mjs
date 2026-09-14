import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/tokens/themes.css', import.meta.url), 'utf8');
const themeNames = ['frost', 'mist', 'graphite'];

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));

  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function contrast(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function getThemeBlock(theme) {
  const prefix = theme === 'frost' ? ':root,\\s*' : '';
  const match = css.match(new RegExp(`${prefix}\\[data-theme='${theme}'\\] \\{([^}]+)\\}`));
  assert.ok(match, `Missing theme: ${theme}`);
  return match[1];
}

function getColor(block, token) {
  const match = block.match(new RegExp(`--nds-color-${token}: (#[0-9a-f]{6})`));
  assert.ok(match, `Missing solid color token: ${token}`);
  return match[1];
}

for (const theme of themeNames) {
  const block = getThemeBlock(theme);
  const surface = getColor(block, 'surface');
  const canvas = getColor(block, 'canvas');

  for (const role of ['text', 'text-secondary', 'text-tertiary']) {
    assert.ok(contrast(getColor(block, role), surface) >= 4.5, `${theme} ${role} must reach 4.5:1 on surface.`);
  }

  assert.ok(contrast(getColor(block, 'text-inverse'), getColor(block, 'accent')) >= 4.5, `${theme} inverse text must reach 4.5:1 on accent.`);
  assert.ok(contrast(getColor(block, 'text-inverse'), getColor(block, 'danger')) >= 4.5, `${theme} inverse text must reach 4.5:1 on danger.`);
  assert.ok(contrast(getColor(block, 'focus'), canvas) >= 3, `${theme} focus must reach 3:1 on canvas.`);

  for (const role of ['success', 'warning', 'danger', 'info']) {
    assert.ok(contrast(getColor(block, role), surface) >= 3, `${theme} ${role} must reach 3:1 on surface.`);
  }
}

console.log('Theme contrast contracts passed.');
