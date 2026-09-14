import assert from 'node:assert/strict';
import { initNavigations } from '../dist/nikba-design-system.js';

class FakeNode extends EventTarget {
  constructor() {
    super();
    this.dataset = {};
    this.attributes = new Map();
    this.parentElement = null;
    this.focused = false;
  }

  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { this.focused = true; }
  contains(node) { return node === this || node === this.navigation || node === this.trigger; }
}

const document = new FakeNode();
const header = new FakeNode();
const trigger = new FakeNode();
const navigation = new FakeNode();
navigation.id = 'primary-nav';
navigation.ownerDocument = document;
navigation.parentElement = header;
navigation.closest = (selector) => selector === '.nds-header' ? header : null;
trigger.dataset.ndsNavigationTrigger = '';
trigger.setAttribute('aria-controls', navigation.id);
header.navigation = navigation;
header.trigger = trigger;
document.defaultView = { matchMedia: () => ({ addEventListener() {}, removeEventListener() {} }) };
document.querySelectorAll = (selector) => selector === '[data-nds-navigation-trigger][aria-controls]' ? [trigger] : [];

const root = { matches: () => false, querySelectorAll: (selector) => selector === '[data-nds-navigation]' ? [navigation] : [] };
const cleanup = initNavigations(root);
assert.equal(header.dataset.ndsEnhanced, 'true');
assert.equal(trigger.getAttribute('aria-expanded'), 'false');

trigger.dispatchEvent(new Event('click'));
assert.equal(navigation.dataset.open, 'true');
assert.equal(trigger.getAttribute('aria-expanded'), 'true');

const escape = new Event('keydown');
Object.defineProperty(escape, 'key', { value: 'Escape' });
header.dispatchEvent(escape);
assert.equal(navigation.dataset.open, 'false');
assert.equal(trigger.focused, true);

cleanup();
trigger.dispatchEvent(new Event('click'));
assert.equal(navigation.dataset.open, undefined, 'Cleanup removes Navigation behavior and state.');

console.log('Responsive Navigation behavior contract passed.');
