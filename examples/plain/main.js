import '@nikba/design-system/css';
import { initDialogs, setTheme } from '@nikba/design-system';

const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');

initDialogs();

toggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'graphite' ? 'frost' : 'graphite';
  setTheme(nextTheme);
  toggle.textContent = nextTheme === 'graphite' ? 'Use Frost' : 'Use Graphite';
});
