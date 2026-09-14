import assert from 'node:assert/strict';
import { initTables } from '../dist/nikba-design-system.js';

class FakeHeader {
  constructor() { this.attributes = new Map([['aria-sort', 'none']]); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
}

class FakeSortControl extends EventTarget {
  constructor(header) { super(); this.dataset = { ndsSort: 'name', sortType: 'text' }; this.header = header; }
  closest(selector) { return selector === 'th' ? this.header : null; }
}

class FakeCell { constructor(value) { this.dataset = { column: 'name', sortValue: value }; this.textContent = value; } }
class FakeRow {
  constructor(value) { this.cell = new FakeCell(value); this.value = value; }
  querySelectorAll(selector) { return selector === '[data-column]' ? [this.cell] : []; }
}

class FakeBody {
  constructor(rows) { this.rows = rows; }
  querySelectorAll(selector) { assert.equal(selector, ':scope > tr:not([data-table-empty])'); return this.rows; }
  append(row) { this.rows = this.rows.filter((candidate) => candidate !== row); this.rows.push(row); }
}

class FakeTable extends EventTarget {
  constructor(control, body) { super(); this.control = control; this.body = body; }
  querySelectorAll(selector) {
    if (selector === '[data-nds-sort]') return [this.control];
    if (selector === '[data-nds-select-row]') return [];
    return [];
  }
  querySelector(selector) {
    if (selector === 'tbody') return this.body;
    if (selector === '[data-nds-select-all]') return null;
    return null;
  }
}

const header = new FakeHeader();
const control = new FakeSortControl(header);
const body = new FakeBody([new FakeRow('Zulu'), new FakeRow('Alpha'), new FakeRow('Echo')]);
const table = new FakeTable(control, body);
const root = { matches: () => false, querySelectorAll: (selector) => selector === '[data-nds-table]' ? [table] : [] };
let direction;
table.addEventListener('nds:table-sort', (event) => { direction = event.detail.direction; });

const cleanup = initTables(root);
control.dispatchEvent(new Event('click'));
assert.deepEqual(body.rows.map((row) => row.value), ['Alpha', 'Echo', 'Zulu']);
assert.equal(direction, 'ascending');
assert.equal(header.getAttribute('aria-sort'), 'ascending');

control.dispatchEvent(new Event('click'));
assert.deepEqual(body.rows.map((row) => row.value), ['Zulu', 'Echo', 'Alpha']);
assert.equal(header.getAttribute('aria-sort'), 'descending');

cleanup();
control.dispatchEvent(new Event('click'));
assert.deepEqual(body.rows.map((row) => row.value), ['Zulu', 'Echo', 'Alpha'], 'Cleanup removes sorting behavior.');

console.log('Table behavior contract passed.');
