import assert from 'node:assert/strict';
import { initPopovers } from '../dist/nikba-design-system.js';

class FakeNode extends EventTarget {
  constructor(dataset = {}) {
    super();
    this.dataset = dataset;
    this.attributes = new Map();
    this.disabled = false;
    this.tabIndex = -1;
    this.textContent = '';
  }

  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  focus() { this.ownerDocument.activeElement = this; }
  getBoundingClientRect() { return { left: 20, right: 140, top: 20, bottom: 60, width: 120, height: 40 }; }
}

class FakeItem extends FakeNode {
  constructor(label, disabled = false) {
    super();
    this.textContent = label;
    this.attributes.set('role', 'menuitem');
    this.attributes.set('aria-disabled', String(disabled));
  }

  closest(selector) { return selector.includes('[role="menuitem"]') ? this : null; }
}

class FakePopover extends FakeNode {
  constructor(trigger, items) {
    super();
    this.id = 'actions-menu';
    this.items = items;
    this.open = false;
    this.style = {};
    this.ownerDocument = {
      activeElement: trigger,
      defaultView: { innerWidth: 800, innerHeight: 600, addEventListener() {}, removeEventListener() {} },
      querySelectorAll: (selector) => selector === '[data-nds-popover-trigger]' ? [trigger] : [],
    };
    trigger.ownerDocument = this.ownerDocument;
    items.forEach((item) => { item.ownerDocument = this.ownerDocument; });
  }

  matches(selector) { return selector === ':popover-open' ? this.open : false; }
  querySelectorAll(selector) { return selector.includes('[role="menuitem"]') ? this.items : []; }
  getBoundingClientRect() { return { left: 0, right: 220, top: 0, bottom: 180, width: 220, height: 180 }; }
  showPopover() { this.open = true; this.emitToggle('open'); }
  hidePopover() { this.open = false; this.emitToggle('closed'); }
  emitToggle(newState) { const event = new Event('beforetoggle'); Object.defineProperty(event, 'newState', { value: newState }); this.dispatchEvent(event); }
}

const trigger = new FakeNode({ ndsPopoverTrigger: 'actions-menu' });
const first = new FakeItem('Duplicate');
const disabled = new FakeItem('Archive', true);
const last = new FakeItem('Rename');
const popover = new FakePopover(trigger, [first, disabled, last]);
const root = { matches: () => false, querySelectorAll: (selector) => selector === '[data-nds-popover]' ? [popover] : [] };

const cleanup = initPopovers(root);
const openEvent = new Event('keydown');
Object.defineProperties(openEvent, { key: { value: 'ArrowUp' } });
trigger.dispatchEvent(openEvent);
assert.equal(popover.open, true);
assert.equal(trigger.getAttribute('aria-expanded'), 'true');
assert.equal(popover.ownerDocument.activeElement, last, 'Arrow Up opens and focuses the last enabled item.');

const moveEvent = new Event('keydown');
Object.defineProperties(moveEvent, { key: { value: 'ArrowDown' }, altKey: { value: false }, ctrlKey: { value: false }, metaKey: { value: false } });
popover.dispatchEvent(moveEvent);
assert.equal(popover.ownerDocument.activeElement, first, 'Arrow navigation wraps and skips disabled items.');

const clickEvent = new Event('click');
Object.defineProperty(clickEvent, 'target', { value: first });
popover.dispatchEvent(clickEvent);
assert.equal(popover.open, false);
assert.equal(trigger.getAttribute('aria-expanded'), 'false');
assert.equal(popover.ownerDocument.activeElement, trigger);

cleanup();
trigger.dispatchEvent(new Event('click'));
assert.equal(popover.open, false, 'Cleanup removes trigger behavior.');

console.log('Popover and menu behavior contract passed.');
