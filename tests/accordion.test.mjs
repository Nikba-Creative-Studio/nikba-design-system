import assert from 'node:assert/strict';
import { initAccordions } from '../dist/nikba-design-system.js';

class FakeDisclosure extends EventTarget {
  constructor(open = false) {
    super();
    this.open = open;
  }

  toggle(open) {
    this.open = open;
    this.dispatchEvent(new Event('toggle'));
  }
}

class FakeAccordion extends EventTarget {
  constructor(items) {
    super();
    this.items = items;
  }

  querySelectorAll(selector) {
    assert.equal(selector, ':scope > .nds-disclosure');
    return this.items;
  }
}

const first = new FakeDisclosure(true);
const second = new FakeDisclosure(false);
const accordion = new FakeAccordion([first, second]);
const root = {
  matches: () => false,
  querySelectorAll: (selector) => {
    assert.equal(selector, '[data-nds-accordion="single"]');
    return [accordion];
  }
};

let openedItem;
accordion.addEventListener('nds:accordion-change', (event) => {
  openedItem = event.detail.openItem;
});

const cleanup = initAccordions(root);
second.toggle(true);
assert.equal(first.open, false);
assert.equal(second.open, true);
assert.equal(openedItem, second);

cleanup();
first.toggle(true);
assert.equal(second.open, true, 'Cleanup should remove single-open behavior.');

console.log('Accordion behavior contract passed.');
