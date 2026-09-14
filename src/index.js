import './index.css';

export const themes = Object.freeze(['frost', 'mist', 'graphite']);
export const glassLevels = Object.freeze(['off', 'soft', 'clear']);

export function setTheme(theme, target = document.documentElement) {
  if (!themes.includes(theme)) {
    throw new TypeError(`Unknown Nikba theme: ${theme}`);
  }

  target.dataset.theme = theme;
}

export function setGlassLevel(level, target = document.documentElement) {
  if (!glassLevels.includes(level)) {
    throw new TypeError(`Unknown Nikba glass level: ${level}`);
  }

  target.dataset.glass = level;
}
