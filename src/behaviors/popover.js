const initializedPopovers = new WeakMap();

function findPopovers(root) {
  const popovers = [...root.querySelectorAll('[data-nds-popover]')];
  if (root.matches?.('[data-nds-popover]')) popovers.unshift(root);
  return popovers;
}

function menuItems(popover) {
  return [...popover.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')]
    .filter((item) => item.getAttribute('aria-disabled') !== 'true' && !item.disabled);
}

function placePopover(popover, trigger) {
  const view = popover.ownerDocument.defaultView;
  if (!view) return;

  const margin = 8;
  const gap = 8;
  const triggerBounds = trigger.getBoundingClientRect();
  const popoverBounds = popover.getBoundingClientRect();
  const alignEnd = popover.dataset.align === 'end';
  let left = alignEnd ? triggerBounds.right - popoverBounds.width : triggerBounds.left;
  let top = triggerBounds.bottom + gap;

  left = Math.min(Math.max(margin, left), view.innerWidth - popoverBounds.width - margin);
  if (top + popoverBounds.height > view.innerHeight - margin && triggerBounds.top - popoverBounds.height - gap >= margin) {
    top = triggerBounds.top - popoverBounds.height - gap;
  }

  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(Math.max(margin, top))}px`;
}

export function initPopovers(root = document) {
  const initialized = [];

  for (const popover of findPopovers(root)) {
    if (initializedPopovers.has(popover) || !popover.id) continue;

    const ownerDocument = popover.ownerDocument;
    const view = ownerDocument.defaultView;
    const triggers = [...ownerDocument.querySelectorAll('[data-nds-popover-trigger]')]
      .filter((trigger) => trigger.dataset.ndsPopoverTrigger === popover.id);
    if (triggers.length === 0) continue;

    const items = menuItems(popover);
    let activeTrigger = triggers[0];
    let typeahead = '';
    let typeaheadTimer;

    const updatePlacement = () => {
      if (popover.matches(':popover-open')) placePopover(popover, activeTrigger);
    };

    const focusItem = (index) => {
      if (items.length === 0) return;
      const nextIndex = (index + items.length) % items.length;
      items.forEach((item, itemIndex) => { item.tabIndex = itemIndex === nextIndex ? 0 : -1; });
      items[nextIndex].focus();
    };

    const open = (trigger, focusIndex = 0) => {
      activeTrigger = trigger;
      if (!popover.matches(':popover-open')) popover.showPopover();
      placePopover(popover, trigger);
      if (items.length > 0) focusItem(focusIndex);
    };

    const triggerListeners = triggers.map((trigger) => {
      trigger.setAttribute('aria-expanded', String(popover.matches(':popover-open')));

      const onClick = () => {
        if (popover.matches(':popover-open')) popover.hidePopover();
        else open(trigger);
      };

      const onKeyDown = (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        open(trigger, event.key === 'ArrowUp' ? items.length - 1 : 0);
      };

      trigger.addEventListener('click', onClick);
      trigger.addEventListener('keydown', onKeyDown);
      return [trigger, onClick, onKeyDown];
    });

    const onBeforeToggle = (event) => {
      const expanded = event.newState === 'open';
      triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', String(expanded)));
      if (expanded) {
        placePopover(popover, activeTrigger);
        view?.addEventListener('resize', updatePlacement);
        view?.addEventListener('scroll', updatePlacement, true);
        if (view?.requestAnimationFrame) view.requestAnimationFrame(updatePlacement);
        else queueMicrotask(updatePlacement);
      } else {
        view?.removeEventListener('resize', updatePlacement);
        view?.removeEventListener('scroll', updatePlacement, true);
      }
    };

    const onKeyDown = (event) => {
      if (items.length === 0) {
        if (event.key === 'Escape') activeTrigger.focus();
        return;
      }

      const currentIndex = items.indexOf(ownerDocument.activeElement);
      let nextIndex;
      if (event.key === 'ArrowDown') nextIndex = currentIndex + 1;
      else if (event.key === 'ArrowUp') nextIndex = currentIndex - 1;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = items.length - 1;
      else if (event.key === 'Escape') {
        event.preventDefault();
        popover.hidePopover();
        activeTrigger.focus();
        return;
      } else if (event.key === 'Tab') {
        popover.hidePopover();
        return;
      } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
        typeahead += event.key.toLocaleLowerCase();
        clearTimeout(typeaheadTimer);
        typeaheadTimer = setTimeout(() => { typeahead = ''; }, 500);
        const matchIndex = items.findIndex((item) => item.textContent.trim().toLocaleLowerCase().startsWith(typeahead));
        if (matchIndex >= 0) focusItem(matchIndex);
        return;
      } else return;

      event.preventDefault();
      focusItem(nextIndex);
    };

    const onClick = (event) => {
      const item = event.target.closest?.('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
      if (!item) return;
      if (item.getAttribute('aria-disabled') === 'true' || item.disabled) {
        event.preventDefault();
        return;
      }

      const role = item.getAttribute('role');
      if (role === 'menuitemcheckbox') {
        item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
      } else if (role === 'menuitemradio') {
        const group = item.dataset.group;
        [...popover.querySelectorAll('[role="menuitemradio"]')]
          .filter((candidate) => !group || candidate.dataset.group === group)
          .forEach((candidate) => candidate.setAttribute('aria-checked', String(candidate === item)));
      }

      popover.dispatchEvent(new CustomEvent('nds:menu-select', { bubbles: true, detail: { item } }));
      if ((role === 'menuitemcheckbox' || role === 'menuitemradio') && item.dataset.closeOnSelect !== 'true') return;
      popover.hidePopover();
      activeTrigger.focus();
    };

    popover.addEventListener('beforetoggle', onBeforeToggle);
    popover.addEventListener('keydown', onKeyDown);
    popover.addEventListener('click', onClick);

    const cleanup = () => {
      clearTimeout(typeaheadTimer);
      view?.removeEventListener('resize', updatePlacement);
      view?.removeEventListener('scroll', updatePlacement, true);
      for (const [trigger, onClick, onKeyDown] of triggerListeners) {
        trigger.removeEventListener('click', onClick);
        trigger.removeEventListener('keydown', onKeyDown);
      }
      popover.removeEventListener('beforetoggle', onBeforeToggle);
      popover.removeEventListener('keydown', onKeyDown);
      popover.removeEventListener('click', onClick);
      initializedPopovers.delete(popover);
    };

    initializedPopovers.set(popover, cleanup);
    initialized.push(cleanup);
  }

  return () => {
    for (const cleanup of initialized) cleanup();
  };
}
