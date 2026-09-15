const initializedSelects = new WeakMap();

function findSelects(root) {
  const selects = [...root.querySelectorAll('[data-nds-select]')];
  if (root.matches?.('[data-nds-select]')) selects.unshift(root);
  return selects;
}

function enabledOptions(listbox) {
  return [...listbox.querySelectorAll('[role="option"]')]
    .filter((option) => option.getAttribute('aria-disabled') !== 'true');
}

function placeListbox(listbox, trigger) {
  const view = listbox.ownerDocument.defaultView;
  if (!view) return;

  const margin = 8;
  const gap = 6;
  const triggerBounds = trigger.getBoundingClientRect();
  const listboxBounds = listbox.getBoundingClientRect();
  const width = Math.max(triggerBounds.width, listboxBounds.width);
  let left = Math.min(triggerBounds.left, view.innerWidth - width - margin);
  let top = triggerBounds.bottom + gap;

  left = Math.max(margin, left);
  if (top + listboxBounds.height > view.innerHeight - margin && triggerBounds.top - listboxBounds.height - gap >= margin) {
    top = triggerBounds.top - listboxBounds.height - gap;
  }

  listbox.style.left = `${Math.round(left)}px`;
  listbox.style.top = `${Math.round(Math.max(margin, top))}px`;
  listbox.style.width = `${Math.round(width)}px`;
}

export function initSelects(root = document) {
  const initialized = [];

  for (const select of findSelects(root)) {
    if (initializedSelects.has(select)) continue;

    const trigger = select.querySelector('[data-nds-select-trigger]');
    const listbox = select.querySelector('[data-nds-select-listbox]');
    const value = select.querySelector('[data-nds-select-value]');
    const label = select.querySelector('[data-nds-select-label]');
    const error = select.querySelector('[data-nds-select-error]');
    if (!trigger || !listbox || !value || !label || !listbox.id) continue;

    const options = enabledOptions(listbox);
    if (options.length === 0) continue;

    const view = select.ownerDocument.defaultView;
    let activeIndex = Math.max(0, options.findIndex((option) => option.getAttribute('aria-selected') === 'true'));
    const initialValue = value.value;
    const initialLabel = label.textContent;
    let typeahead = '';
    let typeaheadTimer;

    const isOpen = () => listbox.matches(':popover-open');
    const updatePlacement = () => { if (isOpen()) placeListbox(listbox, trigger); };

    const setActive = (index) => {
      activeIndex = (index + options.length) % options.length;
      options.forEach((option, optionIndex) => {
        if (optionIndex === activeIndex) option.dataset.active = 'true';
        else delete option.dataset.active;
      });
      trigger.setAttribute('aria-activedescendant', options[activeIndex].id);
      options[activeIndex].scrollIntoView?.({ block: 'nearest' });
    };

    const open = (index = activeIndex) => {
      if (!isOpen()) listbox.showPopover();
      setActive(index);
      placeListbox(listbox, trigger);
    };

    const close = () => {
      if (isOpen()) listbox.hidePopover();
    };

    const selectOption = (option) => {
      const nextValue = option.dataset.value ?? option.textContent.trim();
      options.forEach((candidate) => candidate.setAttribute('aria-selected', String(candidate === option)));
      activeIndex = options.indexOf(option);
      value.value = nextValue;
      label.textContent = option.textContent.trim();
      if (select.hasAttribute('data-nds-select-required')) {
        trigger.setAttribute('aria-invalid', String(!nextValue));
        if (error) error.hidden = Boolean(nextValue);
      }
      close();
      trigger.focus();
      value.dispatchEvent(new Event('input', { bubbles: true }));
      value.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new CustomEvent('nds:select-change', {
        bubbles: true,
        detail: { value: nextValue, option },
      }));
    };

    const onTriggerClick = () => {
      if (isOpen()) close();
      else open(activeIndex);
    };

    const onTriggerKeyDown = (event) => {
      let nextIndex;
      if (event.key === 'ArrowDown') nextIndex = isOpen() ? activeIndex + 1 : activeIndex;
      else if (event.key === 'ArrowUp') nextIndex = isOpen() ? activeIndex - 1 : activeIndex;
      else if (event.key === 'Home' && isOpen()) nextIndex = 0;
      else if (event.key === 'End' && isOpen()) nextIndex = options.length - 1;
      else if ((event.key === 'Enter' || event.key === ' ') && isOpen()) {
        event.preventDefault();
        selectOption(options[activeIndex]);
        return;
      } else if (event.key === 'Escape' && isOpen()) {
        event.preventDefault();
        close();
        return;
      } else if (event.key === 'Tab' && isOpen()) {
        close();
        return;
      } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
        typeahead += event.key.toLocaleLowerCase();
        clearTimeout(typeaheadTimer);
        typeaheadTimer = setTimeout(() => { typeahead = ''; }, 500);
        const matchIndex = options.findIndex((option) => option.textContent.trim().toLocaleLowerCase().startsWith(typeahead));
        if (matchIndex >= 0) {
          event.preventDefault();
          open(matchIndex);
        }
        return;
      } else return;

      event.preventDefault();
      open(nextIndex);
    };

    const onListboxPointerDown = (event) => {
      if (event.target.closest?.('[role="option"]')) event.preventDefault();
    };

    const onListboxClick = (event) => {
      const option = event.target.closest?.('[role="option"]');
      if (!option || option.getAttribute('aria-disabled') === 'true') return;
      selectOption(option);
    };

    const onBeforeToggle = (event) => {
      const expanded = event.newState === 'open';
      trigger.setAttribute('aria-expanded', String(expanded));
      if (expanded) {
        view?.addEventListener('resize', updatePlacement);
        view?.addEventListener('scroll', updatePlacement, true);
        view?.requestAnimationFrame?.(updatePlacement);
      } else {
        trigger.removeAttribute('aria-activedescendant');
        options.forEach((option) => { delete option.dataset.active; });
        view?.removeEventListener('resize', updatePlacement);
        view?.removeEventListener('scroll', updatePlacement, true);
      }
    };

    const form = value.form;
    const onFormReset = () => queueMicrotask(() => {
      const initialOption = options.find((option) => (option.dataset.value ?? option.textContent.trim()) === initialValue);
      value.value = initialValue;
      label.textContent = initialLabel;
      options.forEach((option) => option.setAttribute('aria-selected', String(option === initialOption)));
      activeIndex = Math.max(0, initialOption ? options.indexOf(initialOption) : 0);
      if (select.hasAttribute('data-nds-select-required')) {
        trigger.setAttribute('aria-invalid', String(!initialValue));
        if (error) error.hidden = Boolean(initialValue);
      }
    });

    trigger.setAttribute('aria-expanded', String(isOpen()));
    trigger.addEventListener('click', onTriggerClick);
    trigger.addEventListener('keydown', onTriggerKeyDown);
    listbox.addEventListener('pointerdown', onListboxPointerDown);
    listbox.addEventListener('click', onListboxClick);
    listbox.addEventListener('beforetoggle', onBeforeToggle);
    form?.addEventListener('reset', onFormReset);

    const cleanup = () => {
      clearTimeout(typeaheadTimer);
      close();
      view?.removeEventListener('resize', updatePlacement);
      view?.removeEventListener('scroll', updatePlacement, true);
      trigger.removeEventListener('click', onTriggerClick);
      trigger.removeEventListener('keydown', onTriggerKeyDown);
      listbox.removeEventListener('pointerdown', onListboxPointerDown);
      listbox.removeEventListener('click', onListboxClick);
      listbox.removeEventListener('beforetoggle', onBeforeToggle);
      form?.removeEventListener('reset', onFormReset);
      initializedSelects.delete(select);
    };

    initializedSelects.set(select, cleanup);
    initialized.push(cleanup);
  }

  return () => { for (const cleanup of initialized) cleanup(); };
}
