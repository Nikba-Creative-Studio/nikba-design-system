const initializedDialogs = new WeakMap();

function findDialogs(root) {
  const dialogs = [...root.querySelectorAll('dialog[data-nds-dialog]')];
  if (root.matches?.('dialog[data-nds-dialog]')) dialogs.unshift(root);
  return dialogs;
}

function focusTarget(dialog) {
  return dialog.querySelector('[autofocus]')
    ?? dialog.querySelector('[data-nds-dialog-initial-focus]')
    ?? dialog.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
}

export function initDialogs(root = document) {
  const initialized = [];

  for (const dialog of findDialogs(root)) {
    if (initializedDialogs.has(dialog) || !dialog.id) continue;

    const ownerDocument = dialog.ownerDocument;
    const triggers = [...ownerDocument.querySelectorAll('[data-nds-dialog-open]')]
      .filter((trigger) => trigger.dataset.ndsDialogOpen === dialog.id);
    const closeControls = [...dialog.querySelectorAll('[data-nds-dialog-close]')];
    let opener = null;

    const open = (trigger) => {
      if (dialog.open) return;
      opener = trigger ?? ownerDocument.activeElement;
      dialog.showModal();
      (focusTarget(dialog) ?? dialog).focus();
      dialog.dispatchEvent(new CustomEvent('nds:dialog-open', { bubbles: true, detail: { opener } }));
    };

    const triggerListeners = triggers.map((trigger) => {
      const listener = () => open(trigger);
      trigger.addEventListener('click', listener);
      return [trigger, listener];
    });

    const closeListeners = closeControls.map((control) => {
      const listener = () => dialog.close(control.dataset.ndsDialogClose ?? '');
      control.addEventListener('click', listener);
      return [control, listener];
    });

    const onClick = (event) => {
      if (dialog.dataset.dismissBackdrop !== 'true' || event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) dialog.close('backdrop');
    };

    const onClose = () => {
      if (opener?.isConnected) opener.focus();
      dialog.dispatchEvent(new CustomEvent('nds:dialog-close', { bubbles: true, detail: { returnValue: dialog.returnValue } }));
      opener = null;
    };

    dialog.addEventListener('click', onClick);
    dialog.addEventListener('close', onClose);

    const cleanup = () => {
      for (const [trigger, listener] of triggerListeners) trigger.removeEventListener('click', listener);
      for (const [control, listener] of closeListeners) control.removeEventListener('click', listener);
      dialog.removeEventListener('click', onClick);
      dialog.removeEventListener('close', onClose);
      initializedDialogs.delete(dialog);
    };

    initializedDialogs.set(dialog, cleanup);
    initialized.push(cleanup);
  }

  return () => {
    for (const cleanup of initialized) cleanup();
  };
}
