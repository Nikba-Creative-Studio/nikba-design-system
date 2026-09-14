import assert from 'node:assert/strict';
import { initDialogs } from '../dist/nikba-design-system.js';

class FakeControl extends EventTarget {
  constructor(dataset = {}) {
    super();
    this.dataset = dataset;
    this.isConnected = true;
    this.focused = false;
  }

  focus() { this.focused = true; }
}

class FakeDialog extends EventTarget {
  constructor(trigger, initial, closeControl) {
    super();
    this.id = 'test-dialog';
    this.dataset = {};
    this.open = false;
    this.returnValue = '';
    this.ownerDocument = {
      activeElement: trigger,
      querySelectorAll: (selector) => selector === '[data-nds-dialog-open]' ? [trigger] : [],
    };
    this.initial = initial;
    this.closeControl = closeControl;
  }

  querySelector(selector) { return selector === '[data-nds-dialog-initial-focus]' ? this.initial : null; }
  querySelectorAll(selector) { return selector === '[data-nds-dialog-close]' ? [this.closeControl] : []; }
  showModal() { this.open = true; }
  close(value = '') { this.open = false; this.returnValue = value; this.dispatchEvent(new Event('close')); }
  focus() {}
}

const trigger = new FakeControl({ ndsDialogOpen: 'test-dialog' });
const initial = new FakeControl();
const closeControl = new FakeControl({ ndsDialogClose: 'confirm' });
const dialog = new FakeDialog(trigger, initial, closeControl);
const root = {
  matches: () => false,
  querySelectorAll: (selector) => selector === 'dialog[data-nds-dialog]' ? [dialog] : [],
};

let opened = false;
let returnValue;
dialog.addEventListener('nds:dialog-open', () => { opened = true; });
dialog.addEventListener('nds:dialog-close', (event) => { returnValue = event.detail.returnValue; });

const cleanup = initDialogs(root);
trigger.dispatchEvent(new Event('click'));
assert.equal(dialog.open, true);
assert.equal(initial.focused, true);
assert.equal(opened, true);

closeControl.dispatchEvent(new Event('click'));
assert.equal(dialog.open, false);
assert.equal(returnValue, 'confirm');
assert.equal(trigger.focused, true);

cleanup();
trigger.dispatchEvent(new Event('click'));
assert.equal(dialog.open, false, 'Cleanup removes trigger behavior.');

console.log('Dialog behavior contract passed.');
