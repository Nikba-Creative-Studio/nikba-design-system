import assert from 'node:assert/strict';
import { initTooltips } from '../dist/nikba-design-system.js';

class FakeTrigger extends EventTarget {
  constructor() {
    super();
    this.dataset = { ndsTooltipTrigger: 'save-tooltip', tooltipDelay: '0' };
    this.attributes = new Map([['aria-describedby', 'existing-help']]);
  }

  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  getBoundingClientRect() { return { left: 100, right: 140, top: 100, bottom: 140, width: 40, height: 40 }; }
}

class FakeTooltip extends EventTarget {
  constructor(trigger) {
    super();
    this.id = 'save-tooltip';
    this.dataset = {};
    this.hidden = false;
    this.style = {};
    this.ownerDocument = {
      defaultView: { innerWidth: 800, innerHeight: 600, addEventListener() {}, removeEventListener() {} },
      querySelectorAll: (selector) => selector === '[data-nds-tooltip-trigger]' ? [trigger] : [],
    };
  }

  getBoundingClientRect() { return { width: 120, height: 32 }; }
}

const trigger = new FakeTrigger();
const tooltip = new FakeTooltip(trigger);
const root = { matches: () => false, querySelectorAll: (selector) => selector === '[data-nds-tooltip]' ? [tooltip] : [] };
const cleanup = initTooltips(root);

assert.equal(trigger.getAttribute('aria-describedby'), 'existing-help save-tooltip');
trigger.dispatchEvent(new Event('focusin'));
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(tooltip.hidden, false);
assert.equal(tooltip.dataset.resolvedPlacement, 'top');

const escape = new Event('keydown');
Object.defineProperty(escape, 'key', { value: 'Escape' });
trigger.dispatchEvent(escape);
assert.equal(tooltip.hidden, true);

cleanup();
assert.equal(trigger.getAttribute('aria-describedby'), 'existing-help');
trigger.dispatchEvent(new Event('focusin'));
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(tooltip.hidden, true, 'Cleanup removes Tooltip behavior.');

console.log('Tooltip behavior contract passed.');
