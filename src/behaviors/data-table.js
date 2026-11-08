import { initTables } from './table.js';
const instances = new WeakMap();
export function initDataTables(root = document) {
  const roots = [...root.querySelectorAll('[data-nds-data-table]')];
  if (root.matches?.('[data-nds-data-table]')) roots.unshift(root);
  const cleanups = [];
  for (const element of roots) {
    if (instances.has(element)) continue;
    const table = element.querySelector('table');
    const cleanupTable = initTables(table);
    const search = element.querySelector('[data-search]');
    const previous = element.querySelector('[data-previous]');
    const next = element.querySelector('[data-next]');
    const status = element.querySelector('[role="status"]');
    const size = Math.max(1, Number(element.dataset.pageSize) || 5);
    let page = 0;
    const all = element.querySelector('[data-page-select]');
    const bulk = element.querySelector('[data-bulk-action]');
    const selectedStatus = element.querySelector('[data-selection-status]');
    const empty = element.querySelector('[data-empty]');
    const selection = () => {
      const visible = [...table.tBodies[0].rows].filter(row => !row.hidden).map(row => row.querySelector('[data-row-select]')).filter(Boolean);
      const selected = [...table.querySelectorAll('[data-row-select]:checked')];
      if (all) { all.checked = visible.length > 0 && visible.every(control => control.checked); all.indeterminate = visible.some(control => control.checked) && !all.checked; all.disabled = !visible.length; }
      if (bulk) bulk.disabled = !selected.length;
      if (selectedStatus) selectedStatus.textContent = selected.length + ' selected across all pages';
    };
    const selectPage = () => { [...table.tBodies[0].rows].filter(row => !row.hidden).forEach(row => { const control = row.querySelector('[data-row-select]'); if (control && !control.disabled) control.checked = all.checked; }); selection(); };
    const bulkAction = () => element.dispatchEvent(new CustomEvent('nds:data-table-action', { bubbles: true, detail: { action: bulk.dataset.bulkAction, values: [...table.querySelectorAll('[data-row-select]:checked')].map(control => control.value) } }));
    all?.addEventListener('change', selectPage);
    bulk?.addEventListener('click', bulkAction);
    table.addEventListener('change', selection);
    const render = () => {
      const rows = [...table.tBodies[0].rows];
      const query = search.value.trim().toLocaleLowerCase();
      const matching = rows.filter(row => row.textContent.toLocaleLowerCase().includes(query));
      page = Math.max(0, Math.min(page, Math.ceil(matching.length / size) - 1));
      rows.forEach(row => row.hidden = true);
      matching.slice(page * size, (page + 1) * size).forEach(row => row.hidden = false);
      if (empty) empty.hidden = matching.length > 0;
      selection();
      previous.disabled = page === 0;
      next.disabled = (page + 1) * size >= matching.length;
      status.textContent = matching.length ? matching.length + ' results · Page ' + (page + 1) + ' of ' + Math.ceil(matching.length / size) : 'No matching results';
    };
    const filter = () => { page = 0; render(); };
    const back = () => { page--; render(); };
    const forward = () => { page++; render(); };
    search.addEventListener('input', filter); previous.addEventListener('click', back); next.addEventListener('click', forward); table.addEventListener('nds:table-sort', render);
    render();
    const cleanup = () => {
      all?.removeEventListener('change', selectPage); bulk?.removeEventListener('click', bulkAction); table.removeEventListener('change', selection);
      cleanupTable(); search.removeEventListener('input', filter); previous.removeEventListener('click', back); next.removeEventListener('click', forward); table.removeEventListener('nds:table-sort', render);
      [...table.tBodies[0].rows].forEach(row => row.hidden = false); instances.delete(element);
    };
    instances.set(element, cleanup); cleanups.push(cleanup);
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
