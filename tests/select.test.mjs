import assert from 'node:assert/strict';
import { initSelects } from '../dist/nikba-design-system.js';

class FakeNode extends EventTarget {
  constructor() {
    super();
    this.attributes = new Map();
    this.dataset = {};
    this.style = {};
    this.textContent = '';
  }

  getAttribute(name) { return this.attributes.get(name) ?? null; }
  hasAttribute(name) { return this.attributes.has(name); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { this.ownerDocument.activeElement = this; }
  getBoundingClientRect() { return { left: 24, right: 324, top: 40, bottom: 92, width: 300, height: 52 }; }
}

class FakeOption extends FakeNode {
  constructor(id, label, value, selected = false) {
    super();
    this.id = id;
    this.textContent = label;
    this.dataset.value = value;
    this.setAttribute('role', 'option');
    this.setAttribute('aria-selected', String(selected));
  }

  closest(selector) { return selector === '[role="option"]' ? this : null; }
  scrollIntoView() {}
}

class FakeListbox extends FakeNode {
  constructor(options) {
    super();
    this.id = 'status-options';
    this.options = options;
    this.open = false;
  }

  matches(selector) { return selector === ':popover-open' ? this.open : false; }
  querySelectorAll(selector) { return selector === '[role="option"]' ? this.options : []; }
  getBoundingClientRect() { return { left: 0, right: 300, top: 0, bottom: 196, width: 300, height: 196 }; }
  showPopover() { this.open = true; this.emitToggle('open'); }
  hidePopover() { this.open = false; this.emitToggle('closed'); }
  emitToggle(newState) {
    const event = new Event('beforetoggle');
    Object.defineProperty(event, 'newState', { value: newState });
    this.dispatchEvent(event);
  }
}

const trigger = new FakeNode();
const value = new FakeNode();
value.value = 'draft';
const label = new FakeNode();
label.textContent = 'Draft';
const error = new FakeNode();
error.hidden = false;
const options = [
  new FakeOption('status-draft', 'Draft', 'draft', true),
  new FakeOption('status-review', 'In review', 'review'),
  new FakeOption('status-approved', 'Approved', 'approved'),
];
const listbox = new FakeListbox(options);
const view = { innerWidth: 800, innerHeight: 600, addEventListener() {}, removeEventListener() {}, requestAnimationFrame(callback) { callback(); } };
const ownerDocument = { activeElement: trigger, defaultView: view };
[trigger, value, label, error, listbox, ...options].forEach((node) => { node.ownerDocument = ownerDocument; });

const select = new FakeNode();
select.ownerDocument = ownerDocument;
select.setAttribute('data-nds-select-required', '');
trigger.setAttribute('aria-invalid', 'true');
select.matches = (selector) => selector === '[data-nds-select]';
select.querySelectorAll = () => [];
select.querySelector = (selector) => ({
  '[data-nds-select-trigger]': trigger,
  '[data-nds-select-listbox]': listbox,
  '[data-nds-select-value]': value,
  '[data-nds-select-label]': label,
  '[data-nds-select-error]': error,
}[selector] ?? null);

let changes = 0;
select.addEventListener('nds:select-change', () => { changes += 1; });
const cleanup = initSelects(select);
assert.equal(trigger.getAttribute('aria-expanded'), 'false');

const openEvent = new Event('keydown');
Object.defineProperties(openEvent, { key: { value: 'ArrowDown' }, altKey: { value: false }, ctrlKey: { value: false }, metaKey: { value: false } });
trigger.dispatchEvent(openEvent);
assert.equal(listbox.open, true);
assert.equal(trigger.getAttribute('aria-expanded'), 'true');
assert.equal(trigger.getAttribute('aria-activedescendant'), 'status-draft');

const moveEvent = new Event('keydown');
Object.defineProperties(moveEvent, { key: { value: 'ArrowDown' }, altKey: { value: false }, ctrlKey: { value: false }, metaKey: { value: false } });
trigger.dispatchEvent(moveEvent);
assert.equal(trigger.getAttribute('aria-activedescendant'), 'status-review');

const chooseEvent = new Event('keydown');
Object.defineProperty(chooseEvent, 'key', { value: 'Enter' });
trigger.dispatchEvent(chooseEvent);
assert.equal(listbox.open, false);
assert.equal(value.value, 'review');
assert.equal(label.textContent, 'In review');
assert.equal(options[1].getAttribute('aria-selected'), 'true');
assert.equal(trigger.getAttribute('aria-invalid'), 'false');
assert.equal(error.hidden, true, 'A valid choice clears the connected error.');
assert.equal(changes, 1);
assert.equal(ownerDocument.activeElement, trigger);

const reopenEvent = new Event('keydown');
Object.defineProperty(reopenEvent, 'key', { value: 'ArrowUp' });
trigger.dispatchEvent(reopenEvent);
const escapeEvent = new Event('keydown');
Object.defineProperty(escapeEvent, 'key', { value: 'Escape' });
trigger.dispatchEvent(escapeEvent);
assert.equal(listbox.open, false);

cleanup();
trigger.dispatchEvent(new Event('click'));
assert.equal(listbox.open, false, 'Cleanup removes Select behavior.');

console.log('Select listbox behavior contract passed.');
