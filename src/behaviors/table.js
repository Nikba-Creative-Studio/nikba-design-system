const initializedTables = new WeakMap();

function findTables(root) {
  const tables = [...root.querySelectorAll('[data-nds-table]')];
  if (root.matches?.('[data-nds-table]')) tables.unshift(root);
  return tables;
}

function compareValues(first, second, type, direction) {
  const multiplier = direction === 'ascending' ? 1 : -1;
  if (type === 'number') return (Number(first) - Number(second)) * multiplier;
  return String(first).localeCompare(String(second), undefined, { numeric: true, sensitivity: 'base' }) * multiplier;
}

export function initTables(root = document) {
  const initialized = [];

  for (const table of findTables(root)) {
    if (initializedTables.has(table)) continue;

    const sortControls = [...table.querySelectorAll('[data-nds-sort]')];
    const body = table.querySelector('tbody');
    const selectAll = table.querySelector('[data-nds-select-all]');
    const rowSelections = [...table.querySelectorAll('[data-nds-select-row]')];
    const listeners = [];

    const syncSelection = (emitChange = true) => {
      const selectableRows = rowSelections.filter((control) => !control.disabled);
      const checkedCount = selectableRows.filter((control) => control.checked).length;
      if (selectAll) {
        selectAll.checked = selectableRows.length > 0 && checkedCount === selectableRows.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < selectableRows.length;
      }
      rowSelections.forEach((control) => {
        const row = control.closest('tr');
        if (row) row.dataset.selected = String(control.checked);
      });
      if (emitChange) {
        table.dispatchEvent(new CustomEvent('nds:table-selection-change', {
          bubbles: true,
          detail: { selected: rowSelections.filter((control) => control.checked), allSelected: selectAll?.checked ?? false },
        }));
      }
    };

    if (selectAll) {
      const onSelectAll = () => {
        rowSelections.forEach((control) => { if (!control.disabled) control.checked = selectAll.checked; });
        syncSelection();
      };
      selectAll.addEventListener('change', onSelectAll);
      listeners.push([selectAll, 'change', onSelectAll]);
    }

    rowSelections.forEach((control) => {
      const onChange = () => syncSelection();
      control.addEventListener('change', onChange);
      listeners.push([control, 'change', onChange]);
    });

    sortControls.forEach((control) => {
      const onSort = () => {
        if (!body) return;
        const header = control.closest('th');
        const key = control.dataset.ndsSort;
        const current = header?.getAttribute('aria-sort');
        const direction = current === 'ascending' ? 'descending' : 'ascending';
        const type = control.dataset.sortType === 'number' ? 'number' : 'text';
        const rows = [...body.querySelectorAll(':scope > tr:not([data-table-empty])')];

        rows.sort((first, second) => {
          const firstCell = [...first.querySelectorAll('[data-column]')].find((cell) => cell.dataset.column === key);
          const secondCell = [...second.querySelectorAll('[data-column]')].find((cell) => cell.dataset.column === key);
          const firstValue = firstCell?.dataset.sortValue ?? firstCell?.textContent.trim() ?? '';
          const secondValue = secondCell?.dataset.sortValue ?? secondCell?.textContent.trim() ?? '';
          return compareValues(firstValue, secondValue, type, direction);
        });

        sortControls.forEach((candidate) => candidate.closest('th')?.setAttribute('aria-sort', candidate === control ? direction : 'none'));
        rows.forEach((row) => body.append(row));
        table.dispatchEvent(new CustomEvent('nds:table-sort', { bubbles: true, detail: { key, direction } }));
      };
      control.addEventListener('click', onSort);
      listeners.push([control, 'click', onSort]);
    });

    if (rowSelections.length > 0) syncSelection(false);

    const cleanup = () => {
      listeners.forEach(([target, type, listener]) => target.removeEventListener(type, listener));
      initializedTables.delete(table);
    };

    initializedTables.set(table, cleanup);
    initialized.push(cleanup);
  }

  return () => {
    for (const cleanup of initialized) cleanup();
  };
}
