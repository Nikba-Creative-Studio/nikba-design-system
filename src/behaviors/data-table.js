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
    const render = () => {
      const rows = [...table.tBodies[0].rows];
      const query = search.value.trim().toLocaleLowerCase();
      const matching = rows.filter(row => row.textContent.toLocaleLowerCase().includes(query));
      page = Math.max(0, Math.min(page, Math.ceil(matching.length / size) - 1));
      rows.forEach(row => row.hidden = true);
      matching.slice(page * size, (page + 1) * size).forEach(row => row.hidden = false);
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
      cleanupTable(); search.removeEventListener('input', filter); previous.removeEventListener('click', back); next.removeEventListener('click', forward); table.removeEventListener('nds:table-sort', render);
      [...table.tBodies[0].rows].forEach(row => row.hidden = false); instances.delete(element);
    };
    instances.set(element, cleanup); cleanups.push(cleanup);
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
