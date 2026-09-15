import { initAccordions } from '../behaviors/accordion.js';
import { initDialogs } from '../behaviors/dialog.js';
import { initForms } from '../behaviors/form.js';
import { initNavigations } from '../behaviors/navigation.js';
import { initPopovers } from '../behaviors/popover.js';
import { initSelects } from '../behaviors/select.js';
import { initTables } from '../behaviors/table.js';
import { initTabs } from '../behaviors/tabs.js';
import { initTooltips } from '../behaviors/tooltip.js';

const definitions = [
  ['[data-nds-accordion="single"]', initAccordions],
  ['[data-nds-tabs]', initTabs],
  ['dialog[data-nds-dialog]', initDialogs],
  ['[data-nds-popover]', initPopovers],
  ['[data-nds-select]', initSelects],
  ['[data-nds-tooltip]', initTooltips],
  ['[data-nds-navigation]', initNavigations],
  ['[data-nds-table]', initTables],
  ['[data-nds-form]', initForms],
];

function matchesWithin(root, selector) {
  const matches = [...(root.querySelectorAll?.(selector) ?? [])];
  if (root.matches?.(selector)) matches.unshift(root);
  return matches;
}

export function observeComponents(root = document) {
  const mounted = new Map();

  const mount = (scope) => {
    for (const [selector, initialize] of definitions) {
      for (const element of matchesWithin(scope, selector)) {
        if (mounted.has(element)) continue;
        mounted.set(element, initialize(element));
      }
    }
  };

  const unmount = (scope) => {
    for (const [selector] of definitions) {
      for (const element of matchesWithin(scope, selector)) {
        mounted.get(element)?.();
        mounted.delete(element);
      }
    }
  };

  const view = root.ownerDocument?.defaultView ?? root.defaultView ?? globalThis;
  const Observer = view.MutationObserver;
  if (typeof Observer !== 'function') throw new TypeError('observeComponents requires MutationObserver support.');

  mount(root);
  const observer = new Observer((records) => {
    for (const record of records) {
      record.removedNodes.forEach(unmount);
      record.addedNodes.forEach(mount);
    }
  });
  observer.observe(root, { childList: true, subtree: true });

  return Object.freeze({
    refresh(scope = root) { mount(scope); },
    disconnect() {
      observer.disconnect();
      for (const cleanup of mounted.values()) cleanup();
      mounted.clear();
    },
  });
}
