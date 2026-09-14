const toastManagers = new WeakMap();
let toastSequence = 0;

function createElement(document, tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

export function createToastManager(region, options = {}) {
  if (!region?.ownerDocument) throw new TypeError('A Toast region element is required.');
  if (toastManagers.has(region)) return toastManagers.get(region);

  const document = region.ownerDocument;
  const maxVisible = Math.max(1, Number(options.maxVisible) || 3);
  const requestedDuration = Number(options.duration);
  const defaultDuration = options.duration === undefined || !Number.isFinite(requestedDuration) ? 5000 : Math.max(0, requestedDuration);
  const queue = [];
  const visible = new Map();
  let destroyed = false;

  region.setAttribute('aria-label', region.getAttribute('aria-label') || 'Notifications');

  const emit = (name, detail) => region.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

  const promote = () => {
    while (!destroyed && visible.size < maxVisible && queue.length > 0) render(queue.shift());
  };

  const dismiss = (id, reason = 'dismiss') => {
    const queuedIndex = queue.findIndex((item) => item.id === id);
    if (queuedIndex >= 0) {
      const [item] = queue.splice(queuedIndex, 1);
      emit('nds:toast-dismiss', { id, reason, toast: null, options: item.options });
      return true;
    }

    const record = visible.get(id);
    if (!record) return false;
    clearTimeout(record.timer);
    record.element.remove();
    visible.delete(id);
    emit('nds:toast-dismiss', { id, reason, toast: record.element, options: record.options });
    promote();
    return true;
  };

  const render = (item) => {
    const { id, options: toastOptions } = item;
    const tone = ['neutral', 'info', 'success', 'warning', 'danger'].includes(toastOptions.tone) ? toastOptions.tone : 'neutral';
    const toast = createElement(document, 'article', `nds-toast nds-toast--${tone}`);
    toast.dataset.toastId = id;
    toast.setAttribute('role', tone === 'danger' || tone === 'warning' ? 'alert' : 'status');

    const content = createElement(document, 'div', 'nds-toast__content');
    if (toastOptions.title) content.append(createElement(document, 'strong', 'nds-toast__title', toastOptions.title));
    if (toastOptions.message) content.append(createElement(document, 'p', 'nds-toast__message', toastOptions.message));
    toast.append(content);

    if (toastOptions.action?.label) {
      const action = createElement(document, 'button', 'nds-toast__action', toastOptions.action.label);
      action.type = 'button';
      action.addEventListener('click', () => {
        toastOptions.action.onSelect?.();
        emit('nds:toast-action', { id, toast, options: toastOptions });
        dismiss(id, 'action');
      });
      toast.append(action);
    }

    const close = createElement(document, 'button', 'nds-toast__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss notification');
    close.addEventListener('click', () => dismiss(id));
    toast.append(close);

    const duration = toastOptions.duration === undefined ? defaultDuration : Math.max(0, Number(toastOptions.duration) || 0);
    const record = { element: toast, options: toastOptions, timer: undefined, remaining: duration, startedAt: 0 };

    const resume = () => {
      if (record.remaining <= 0 || record.timer) return;
      record.startedAt = Date.now();
      record.timer = setTimeout(() => dismiss(id, 'timeout'), record.remaining);
    };
    const pause = () => {
      if (!record.timer) return;
      clearTimeout(record.timer);
      record.timer = undefined;
      record.remaining = Math.max(0, record.remaining - (Date.now() - record.startedAt));
    };

    toast.addEventListener('pointerenter', pause);
    toast.addEventListener('pointerleave', resume);
    toast.addEventListener('focusin', pause);
    toast.addEventListener('focusout', (event) => {
      if (!toast.contains(event.relatedTarget)) resume();
    });

    visible.set(id, record);
    region.append(toast);
    resume();
    emit('nds:toast-show', { id, toast, options: toastOptions });
  };

  const show = (toastOptions = {}) => {
    if (destroyed) throw new Error('This Toast manager has been destroyed.');
    if (!toastOptions.title && !toastOptions.message) throw new TypeError('A Toast requires a title or message.');
    const id = toastOptions.id || `nds-toast-${++toastSequence}`;
    if (visible.has(id) || queue.some((item) => item.id === id)) return { id, dismiss: () => dismiss(id) };
    queue.push({ id, options: toastOptions });
    promote();
    return { id, dismiss: () => dismiss(id) };
  };

  const dismissAll = () => {
    queue.splice(0);
    for (const id of [...visible.keys()]) dismiss(id, 'dismiss-all');
  };

  const destroy = () => {
    dismissAll();
    destroyed = true;
    toastManagers.delete(region);
  };

  const manager = Object.freeze({ show, dismiss, dismissAll, destroy });
  toastManagers.set(region, manager);
  return manager;
}
