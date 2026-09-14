import assert from 'node:assert/strict';
import { createToastManager } from '../dist/nikba-design-system.js';

class FakeElement extends EventTarget {
  constructor(tag = 'div') {
    super();
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.dataset = {};
    this.attributes = new Map();
    this.parent = null;
    this.className = '';
    this.textContent = '';
  }

  append(...elements) { elements.forEach((element) => { element.parent = this; this.children.push(element); }); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter((child) => child !== this); }
  contains(element) { return this === element || this.children.includes(element); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
}

const document = { createElement: (tag) => new FakeElement(tag) };
const region = new FakeElement();
region.ownerDocument = document;
let shown = 0;
let dismissed = 0;
region.addEventListener('nds:toast-show', () => { shown += 1; });
region.addEventListener('nds:toast-dismiss', () => { dismissed += 1; });

const manager = createToastManager(region, { maxVisible: 2, duration: 0 });
assert.equal(createToastManager(region), manager, 'A region receives one idempotent manager.');
const first = manager.show({ title: 'Saved' });
manager.show({ message: 'Published' });
manager.show({ title: 'Queued' });
assert.equal(region.children.length, 2);
assert.equal(shown, 2);

first.dismiss();
assert.equal(region.children.length, 2, 'Dismissing promotes the next queued Toast.');
assert.equal(shown, 3);
assert.equal(dismissed, 1);

manager.dismissAll();
assert.equal(region.children.length, 0);
assert.equal(dismissed, 3);
assert.throws(() => manager.show({}), TypeError);

manager.destroy();
assert.throws(() => manager.show({ title: 'Late' }), /destroyed/);

console.log('Toast manager contract passed.');
