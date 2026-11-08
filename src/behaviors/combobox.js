const mounted = new WeakMap();
let sequence = 0;

/** Enhance a labeled select while retaining its submission, reset and validation semantics. */
export function initComboboxes(root = document) {
  const selects = [...root.querySelectorAll('[data-nds-combobox]')];
  if (root.matches?.('[data-nds-combobox]')) selects.unshift(root);
  const cleanups = selects.map(select => {
    if (mounted.has(select)) return () => {};
    const doc = select.ownerDocument;
    const shell = doc.createElement('div');
    shell.className = 'nds-combobox';
    const input = doc.createElement('input');
    input.className = 'nds-input';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.autocomplete = 'off';
    input.disabled = select.disabled;
    for (const name of ['aria-describedby', 'aria-invalid', 'aria-required']) {
      if (select.hasAttribute(name)) input.setAttribute(name, select.getAttribute(name));
    }
    if (select.required) input.setAttribute('aria-required', 'true');
    const label = select.labels?.[0];
    input.setAttribute('aria-label', label?.textContent.trim() || select.getAttribute('aria-label') || 'Choose an option');
    const list = doc.createElement('div');
    list.className = 'nds-combobox__list';
    list.id = 'nds-combobox-' + ++sequence;
    list.setAttribute('role', 'listbox');
    input.setAttribute('aria-controls', list.id);
    list.hidden = true;
    let active = -1;
    let visible = [];
    const sync = () => { input.disabled = select.disabled || select.matches(':disabled'); input.value = select.selectedOptions[0]?.value ? select.selectedOptions[0].textContent : ''; };
    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); };
    const render = () => {
      visible = [...select.options].filter(o => o.value && !o.disabled && !o.parentElement.disabled && o.textContent.toLocaleLowerCase().includes(input.value.toLocaleLowerCase()));
      active = -1;
      input.removeAttribute('aria-activedescendant');
      list.replaceChildren();
      visible.forEach((option, index) => {
        const item = doc.createElement('div');
        item.id = list.id + '-' + index;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(option.selected));
        item.textContent = option.textContent;
        item.addEventListener('pointerdown', e => e.preventDefault());
        item.addEventListener('click', () => choose(index));
        list.append(item);
      });
      if (!visible.length) { const empty = doc.createElement('div'); empty.textContent = 'No matching options'; empty.setAttribute('role', 'status'); list.append(empty); }
      list.hidden = false;
      const rect = input.getBoundingClientRect();
      const below = doc.defaultView.innerHeight - rect.bottom;
      const above = rect.top;
      list.style.top = below >= 160 || below >= above ? '100%' : 'auto';
      list.style.bottom = list.style.top === 'auto' ? '100%' : 'auto';
      list.style.maxHeight = Math.max(44, Math.min(256, Math.max(below, above) - 16)) + 'px';
      input.setAttribute('aria-expanded', 'true');
    };
    const choose = index => {
      if (!visible[index]) return;
      select.value = visible[index].value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync(); close();
    };
    const keydown = e => {
      if (e.key === 'Escape') { close(); sync(); return; }
      if (e.key === 'Enter' && !list.hidden) { e.preventDefault(); choose(active); }
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        if (list.hidden) { input.value = ''; render(); }
        if (!visible.length) return;
        active = active < 0 ? (e.key === 'ArrowDown' ? 0 : visible.length - 1) : (active + (e.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length;
        [...list.children].forEach((item, i) => item.dataset.active = String(i === active));
        input.setAttribute('aria-activedescendant', list.children[active].id);
        list.children[active].scrollIntoView({ block: 'nearest' });
      }
    };
    const blur = () => { close(); sync(); };
    const reset = () => queueMicrotask(() => { sync(); close(); });
    const invalid = e => { e.preventDefault(); input.setAttribute('aria-invalid', 'true'); input.focus(); };
    const change = () => { sync(); input.removeAttribute('aria-invalid'); };
    select.before(shell); shell.append(input, list, select);
    select.hidden = true;
    const observer = new doc.defaultView.MutationObserver(sync);
    observer.observe(select, { attributes: true, attributeFilter: ['disabled'], subtree: true });
    input.addEventListener('input', render);
    input.addEventListener('keydown', keydown);
    input.addEventListener('blur', blur);
    select.addEventListener('change', change);
    select.addEventListener('invalid', invalid);
    select.form?.addEventListener('reset', reset);
    const labelClick = e => { e.preventDefault(); input.focus(); };
    label?.addEventListener('click', labelClick);
    sync();
    const cleanup = () => {
      input.removeEventListener('input', render); input.removeEventListener('keydown', keydown); input.removeEventListener('blur', blur);
      select.removeEventListener('change', change); select.removeEventListener('invalid', invalid);
      select.form?.removeEventListener('reset', reset); label?.removeEventListener('click', labelClick);
      observer.disconnect();
      shell.before(select); select.hidden = false; shell.remove(); mounted.delete(select);
    };
    mounted.set(select, cleanup);
    return cleanup;
  });
  return () => cleanups.forEach(cleanup => cleanup());
}
