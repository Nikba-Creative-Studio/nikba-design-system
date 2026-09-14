import assert from 'node:assert/strict';
import { initForms } from '../dist/nikba-design-system.js';

class FakeControl extends EventTarget {
  constructor(name, valid) {
    super();
    this.name = name;
    this.disabled = false;
    this.validity = { valid };
    this.attributes = new Map();
    this.focused = false;
  }
  matches(selector) { return selector.includes('input'); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { this.focused = true; }
}

class FakeError { constructor(name) { this.dataset = { ndsError: name }; this.hidden = true; } }
class FakeSummary {
  constructor() { this.hidden = true; this.focused = false; }
  focus() { this.focused = true; }
  querySelectorAll() { return []; }
}

class FakeForm extends EventTarget {
  constructor(control, error, summary) {
    super();
    this.control = control;
    this.error = error;
    this.summary = summary;
    this.noValidate = false;
  }
  querySelectorAll(selector) {
    if (selector === 'input, select, textarea') return [this.control];
    if (selector === '[data-nds-error]') return [this.error];
    return [];
  }
  querySelector(selector) { return selector === '[data-nds-error-summary]' ? this.summary : null; }
}

const control = new FakeControl('email', false);
const error = new FakeError('email');
const summary = new FakeSummary();
const form = new FakeForm(control, error, summary);
const root = { matches: () => false, querySelectorAll: (selector) => selector === '[data-nds-form]' ? [form] : [] };
let invalidCount = 0;
let validCount = 0;
form.addEventListener('nds:form-invalid', (event) => { invalidCount = event.detail.invalidControls.length; });
form.addEventListener('nds:form-valid', () => { validCount += 1; });

const cleanup = initForms(root);
assert.equal(form.noValidate, true);
const invalidSubmit = new Event('submit', { cancelable: true });
form.dispatchEvent(invalidSubmit);
assert.equal(invalidSubmit.defaultPrevented, true);
assert.equal(control.attributes.get('aria-invalid'), 'true');
assert.equal(error.hidden, false);
assert.equal(summary.hidden, false);
assert.equal(summary.focused, true);
assert.equal(invalidCount, 1);

control.validity.valid = true;
const input = new Event('input');
Object.defineProperty(input, 'target', { value: control });
form.dispatchEvent(input);
assert.equal(control.attributes.has('aria-invalid'), false);
assert.equal(error.hidden, true);
assert.equal(summary.hidden, true);

const validSubmit = new Event('submit', { cancelable: true });
form.dispatchEvent(validSubmit);
assert.equal(validSubmit.defaultPrevented, false);
assert.equal(validCount, 1);

cleanup();
assert.equal(form.noValidate, false);
control.validity.valid = false;
const afterCleanup = new Event('submit', { cancelable: true });
form.dispatchEvent(afterCleanup);
assert.equal(afterCleanup.defaultPrevented, false);

console.log('Form validation behavior contract passed.');
