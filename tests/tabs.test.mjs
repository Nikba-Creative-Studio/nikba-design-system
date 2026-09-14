import assert from 'node:assert/strict';
import { initTabs } from '../dist/nikba-design-system.js';

class FakeTab {
  constructor(id, controls, selected = false, disabled = false) {
    this.id = id;
    this.disabled = false;
    this.tabIndex = selected ? 0 : -1;
    this.attributes = new Map([
      ['role', 'tab'],
      ['aria-controls', controls],
      ['aria-selected', String(selected)],
      ['aria-disabled', String(disabled)],
    ]);
  }

  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  closest(selector) { return selector === '[role="tab"]' ? this : null; }
  focus() { this.ownerDocument.activeElement = this; }
}

class FakeTablist {
  constructor(tabs, orientation = 'horizontal') {
    this.tabs = tabs;
    this.orientation = orientation;
    this.listeners = new Map();
  }

  getAttribute(name) { return name === 'aria-orientation' ? this.orientation : null; }
  querySelectorAll(selector) { assert.equal(selector, '[role="tab"]'); return this.tabs; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type, listener) { if (this.listeners.get(type) === listener) this.listeners.delete(type); }
  emit(type, target, key) {
    let prevented = false;
    this.listeners.get(type)?.({ target, key, preventDefault: () => { prevented = true; } });
    return prevented;
  }
}

class FakeGroup extends EventTarget {
  constructor(tabs, panels, activation = 'automatic', orientation = 'horizontal') {
    super();
    this.dataset = { activation };
    this.ownerDocument = { activeElement: null, getElementById: (id) => panels.get(id) ?? null };
    tabs.forEach((tab) => { tab.ownerDocument = this.ownerDocument; });
    this.tablist = new FakeTablist(tabs, orientation);
  }

  querySelector(selector) { assert.equal(selector, '[role="tablist"]'); return this.tablist; }
}

function createGroup({ activation = 'automatic', orientation = 'horizontal' } = {}) {
  const tabs = [
    new FakeTab('first-tab', 'first-panel', true),
    new FakeTab('disabled-tab', 'disabled-panel', false, true),
    new FakeTab('last-tab', 'last-panel'),
  ];
  const panels = new Map([
    ['first-panel', { id: 'first-panel', hidden: false }],
    ['disabled-panel', { id: 'disabled-panel', hidden: false }],
    ['last-panel', { id: 'last-panel', hidden: false }],
  ]);
  return { group: new FakeGroup(tabs, panels, activation, orientation), tabs, panels };
}

const automatic = createGroup();
const manual = createGroup({ activation: 'manual', orientation: 'vertical' });
const root = {
  matches: () => false,
  querySelectorAll: (selector) => {
    assert.equal(selector, '[data-nds-tabs]');
    return [automatic.group, manual.group];
  },
};

let selectedTab;
automatic.group.addEventListener('nds:tabs-change', (event) => { selectedTab = event.detail.tab; });
const cleanup = initTabs(root);

assert.equal(automatic.panels.get('disabled-panel').hidden, true);
assert.equal(automatic.group.tablist.emit('keydown', automatic.tabs[0], 'ArrowRight'), true);
assert.equal(selectedTab, automatic.tabs[2], 'Arrow navigation skips disabled tabs and activates the next tab.');
assert.equal(automatic.group.ownerDocument.activeElement, automatic.tabs[2]);
assert.equal(automatic.panels.get('last-panel').hidden, false);

manual.group.tablist.emit('keydown', manual.tabs[0], 'ArrowDown');
assert.equal(manual.tabs[0].getAttribute('aria-selected'), 'true', 'Manual navigation preserves selection until activation.');
assert.equal(manual.group.ownerDocument.activeElement, manual.tabs[2]);
manual.group.tablist.emit('keydown', manual.tabs[2], 'Enter');
assert.equal(manual.tabs[2].getAttribute('aria-selected'), 'true');

cleanup();
automatic.group.tablist.emit('keydown', automatic.tabs[2], 'Home');
assert.equal(automatic.tabs[2].getAttribute('aria-selected'), 'true', 'Cleanup removes Tab listeners.');

console.log('Tabs behavior contract passed.');
