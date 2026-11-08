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
    const update = () => {
      const query = search.value.trim().toLocaleLowerCase();
      choices.forEach(label => label.hidden = !label.textContent.toLocaleLowerCase().includes(query));
      const count = choices.filter(label => label.querySelector('input').checked).length;
      status.textContent = count + ' selected · ' + choices.filter(label => !label.hidden).length + ' available';
    };
    const reset = () => queueMicrotask(update);
    search.addEventListener('input', update);
    element.addEventListener('change', update);
    const form = element.closest('form');
    form?.addEventListener('reset', reset);
    update();
    const cleanup = () => {
      search.removeEventListener('input', update); element.removeEventListener('change', update); form?.removeEventListener('reset', reset);
      choices.forEach(label => label.hidden = false); instances.delete(element);
    };
    instances.set(element, cleanup); cleanups.push(cleanup);
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
