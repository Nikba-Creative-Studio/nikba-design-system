const instances = new WeakMap();
export function initMultiSelects(root = document) {
  const roots = [...root.querySelectorAll('[data-nds-multi-select]')];
  if (root.matches?.('[data-nds-multi-select]')) roots.unshift(root);
  const cleanups = [];
  for (const element of roots) {
    if (instances.has(element)) continue;
    const search = element.querySelector('input[type="search"]');
    const choices = [...element.querySelectorAll('label')];
    const status = element.querySelector('[role="status"]');
    const chips = element.ownerDocument.createElement('div');
    chips.className = 'nds-multi-select__chips';
    chips.setAttribute('aria-label', 'Selected options');
    search.after(chips);
    const clear = element.ownerDocument.createElement('button');
    clear.type = 'button'; clear.className = 'nds-button nds-button--secondary';
    clear.textContent = 'Clear all';
    element.append(clear);
    const update = () => {
      const query = search.value.trim().toLocaleLowerCase();
      choices.forEach(label => label.hidden = !label.textContent.toLocaleLowerCase().includes(query));
      chips.replaceChildren();
      choices.filter(label => label.querySelector('input').checked).forEach(label => {
        const checkbox = label.querySelector('input');
        const button = element.ownerDocument.createElement('button');
        button.type = 'button'; button.className = 'nds-chip';
        button.textContent = label.textContent.trim() + ' ×';
        button.setAttribute('aria-label', 'Remove ' + label.textContent.trim());
        button.disabled = checkbox.matches(':disabled');
        button.addEventListener('click', () => {
          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          search.focus();
        });
        chips.append(button);
      });
      const count = choices.filter(label => label.querySelector('input').checked).length;
      clear.disabled = count === 0 || element.matches(':disabled');
      search.disabled = element.matches(':disabled');
      status.textContent = count + ' selected · ' + choices.filter(label => !label.hidden).length + ' available';
    };
    const clearAll = () => {
      choices.forEach(label => { const control = label.querySelector('input'); if (!control.matches(':disabled')) control.checked = false; });
      element.dispatchEvent(new Event('change', { bubbles: true }));
      search.focus();
    };
    clear.addEventListener('click', clearAll);
    const reset = () => queueMicrotask(update);
    search.addEventListener('input', update);
    element.addEventListener('change', update);
    const form = element.closest('form');
    form?.addEventListener('reset', reset);
    update();
    const cleanup = () => {
      search.removeEventListener('input', update); element.removeEventListener('change', update); form?.removeEventListener('reset', reset);
      clear.removeEventListener('click', clearAll); clear.remove(); chips.remove();
      choices.forEach(label => label.hidden = false); instances.delete(element);
    };
    instances.set(element, cleanup); cleanups.push(cleanup);
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
