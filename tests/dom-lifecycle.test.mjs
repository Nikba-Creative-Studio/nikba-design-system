import assert from 'node:assert/strict';
import { observeComponents } from '../dist/nikba-design-system.js';

class FakeObserver {
  static current;
  constructor(callback) { this.callback = callback; this.disconnected = false; FakeObserver.current = this; }
  observe(target, options) { this.target = target; this.options = options; }
  disconnect() { this.disconnected = true; }
  morph({ added = [], removed = [] }) { this.callback([{ addedNodes: added, removedNodes: removed }]); }
}

class FakeForm extends EventTarget {
  constructor() { super(); this.noValidate = false; }
  matches(selector) { return selector === '[data-nds-form]'; }
  querySelectorAll() { return []; }
  querySelector() { return null; }
}

class FakeRoot {
  constructor(form) { this.form = form; this.defaultView = { MutationObserver: FakeObserver }; }
  matches() { return false; }
  querySelectorAll(selector) { return selector === '[data-nds-form]' && this.form ? [this.form] : []; }
}

const first = new FakeForm();
const root = new FakeRoot(first);
const lifecycle = observeComponents(root);
assert.equal(first.noValidate, true, 'Existing component roots initialize.');
assert.deepEqual(FakeObserver.current.options, { childList: true, subtree: true });

const second = new FakeForm();
FakeObserver.current.morph({ removed: [first], added: [second] });
assert.equal(first.noValidate, false, 'Removed roots run cleanup.');
assert.equal(second.noValidate, true, 'Added roots initialize.');

lifecycle.refresh(second);
assert.equal(second.noValidate, true, 'Refresh remains idempotent.');
lifecycle.disconnect();
assert.equal(second.noValidate, false, 'Disconnect cleans mounted roots.');
assert.equal(FakeObserver.current.disconnected, true);

console.log('Dynamic DOM lifecycle contract passed.');
