const initializedSelects = new WeakMap();
let generatedSelectId = 0;

function findSelects(root) {
  const selects = [...root.querySelectorAll('[data-nds-select]')];
  if (root.matches?.('[data-nds-select]')) selects.unshift(root);
  return selects;
}

function enabledOptions(listbox) {
  return [...listbox.querySelectorAll('[role="option"]')]
    .filter((option) => option.getAttribute('aria-disabled') !== 'true');
}

function ensureId(element, prefix) {
  if (element.id) return element.id;
  generatedSelectId += 1;
  element.id = `${prefix}-${generatedSelectId}`;
  return element.id;
}

function createOption(document, option, listboxId, index) {
  const item = document.createElement('div');
  item.className = 'nds-selectbox__option';
  item.id = `${listboxId}-option-${index}`;
  item.setAttribute('role', 'option');
  item.setAttribute('aria-selected', String(option.selected));
  if (option.disabled) item.setAttribute('aria-disabled', 'true');
  item.dataset.value = option.value;
  item.textContent = option.textContent.trim();
  return item;
}

function enhanceNativeSource(select, source) {
  const document = select.ownerDocument;
  const field = select.closest?.('.nds-field');
  const fieldLabel = field?.querySelector('.nds-field__label');
  const previousSourceId = source.id;
  const previousLabelId = fieldLabel?.id ?? '';
  const sourceId = ensureId(source, 'nds-select');
  const labelId = fieldLabel ? ensureId(fieldLabel, `${sourceId}-label`) : null;
  const listboxId = `${sourceId}-options`;
  const valueLabelId = `${sourceId}-value`;
  const trigger = document.createElement('button');
  const valueLabel = document.createElement('span');
  const listbox = document.createElement('div');
  const selectedOption = source.selectedOptions?.[0] ?? source.options?.[0];
  const previousTabIndex = source.getAttribute('tabindex');
  const previousAriaHidden = source.getAttribute('aria-hidden');
  const previousLabelFor = fieldLabel?.tagName === 'LABEL' ? fieldLabel.getAttribute('for') : null;
  const hadValueMarker = source.hasAttribute('data-nds-select-value');
  const hadNativeClass = source.classList.contains('nds-selectbox__native');
  let optionIndex = 0;

  trigger.className = 'nds-selectbox__trigger';
  trigger.id = `${sourceId}-trigger`;
  trigger.type = 'button';
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-controls', listboxId);
  if (labelId) trigger.setAttribute('aria-labelledby', `${labelId} ${valueLabelId}`);
  else if (source.getAttribute('aria-label')) trigger.setAttribute('aria-label', source.getAttribute('aria-label'));
  if (source.getAttribute('aria-describedby')) trigger.setAttribute('aria-describedby', source.getAttribute('aria-describedby'));
  if (source.required) trigger.setAttribute('aria-required', 'true');
  if (source.getAttribute('aria-invalid')) trigger.setAttribute('aria-invalid', source.getAttribute('aria-invalid'));
  trigger.disabled = source.disabled;
  trigger.dataset.ndsSelectTrigger = '';

  valueLabel.id = valueLabelId;
  valueLabel.dataset.ndsSelectLabel = '';
  valueLabel.textContent = selectedOption?.textContent.trim() ?? '';
  trigger.append(valueLabel);

  listbox.className = 'nds-selectbox__listbox';
  listbox.id = listboxId;
  listbox.setAttribute('role', 'listbox');
  if (labelId) listbox.setAttribute('aria-labelledby', labelId);
  else if (source.getAttribute('aria-label')) listbox.setAttribute('aria-label', source.getAttribute('aria-label'));
  listbox.setAttribute('popover', 'auto');
  listbox.dataset.ndsSelectListbox = '';

  for (const child of source.children) {
    if (child.tagName === 'OPTGROUP') {
      const group = document.createElement('div');
      group.className = 'nds-selectbox__group';
      group.setAttribute('role', 'presentation');
      group.textContent = child.label;
      listbox.append(group);
      for (const option of child.children) {
        if (option.hidden) continue;
        listbox.append(createOption(document, option, listboxId, optionIndex));
        optionIndex += 1;
      }
    } else if (child.tagName === 'OPTION') {
      if (child.hidden) continue;
      listbox.append(createOption(document, child, listboxId, optionIndex));
      optionIndex += 1;
    }
  }

  source.classList.add('nds-selectbox__native');
  source.dataset.ndsSelectValue = '';
  source.tabIndex = -1;
  source.setAttribute('aria-hidden', 'true');
  if (fieldLabel?.tagName === 'LABEL') fieldLabel.setAttribute('for', trigger.id);
  select.append(trigger, listbox);
  select.dataset.ndsEnhanced = 'true';

  return () => {
    trigger.remove();
    listbox.remove();
    if (!hadNativeClass) source.classList.remove('nds-selectbox__native');
    if (!hadValueMarker) delete source.dataset.ndsSelectValue;
    delete select.dataset.ndsEnhanced;
    if (previousTabIndex === null) source.removeAttribute('tabindex');
    else source.setAttribute('tabindex', previousTabIndex);
    if (previousAriaHidden === null) source.removeAttribute('aria-hidden');
    else source.setAttribute('aria-hidden', previousAriaHidden);
    if (!previousSourceId) source.removeAttribute('id');
    if (fieldLabel && !previousLabelId) fieldLabel.removeAttribute('id');
    if (fieldLabel?.tagName === 'LABEL') {
      if (previousLabelFor === null) fieldLabel.removeAttribute('for');
      else fieldLabel.setAttribute('for', previousLabelFor);
    }
  };
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

    let trigger = select.querySelector('[data-nds-select-trigger]');
    let listbox = select.querySelector('[data-nds-select-listbox]');
    let value = select.querySelector('[data-nds-select-value]') ?? select.querySelector('select');
    let removeGeneratedMarkup = null;
    if (!trigger && !listbox && value?.tagName === 'SELECT') {
      removeGeneratedMarkup = enhanceNativeSource(select, value);
      trigger = select.querySelector('[data-nds-select-trigger]');
      listbox = select.querySelector('[data-nds-select-listbox]');
      value = select.querySelector('[data-nds-select-value]');
    }
    const label = select.querySelector('[data-nds-select-label]');
    const error = select.querySelector('[data-nds-select-error]');
    if (!trigger || !listbox || !value || !label || !listbox.id) continue;

    const options = enabledOptions(listbox);
    if (options.length === 0) continue;

    const view = select.ownerDocument.defaultView;
    let activeIndex = Math.max(0, options.findIndex((option) => option.getAttribute('aria-selected') === 'true'));
    const initialValue = value.value;
    const initialLabel = label.textContent;
    const required = select.hasAttribute('data-nds-select-required') || Boolean(value.required);
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
      if (required) {
        trigger.setAttribute('aria-invalid', String(!nextValue));
        trigger.dataset.placeholder = String(!nextValue);
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

    const syncFromValue = () => {
      const selectedOption = options.find((option) => (option.dataset.value ?? option.textContent.trim()) === value.value);
      if (selectedOption) {
        options.forEach((option) => option.setAttribute('aria-selected', String(option === selectedOption)));
        activeIndex = options.indexOf(selectedOption);
        label.textContent = selectedOption.textContent.trim();
      }
      if (required) {
        trigger.setAttribute('aria-invalid', String(!value.value));
        trigger.dataset.placeholder = String(!value.value);
        if (error) error.hidden = Boolean(value.value);
      }
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
      if (required) {
        trigger.setAttribute('aria-invalid', String(!initialValue));
        trigger.dataset.placeholder = String(!initialValue);
        if (error) error.hidden = Boolean(initialValue);
      }
    });

    trigger.setAttribute('aria-expanded', String(isOpen()));
    if (required) trigger.dataset.placeholder = String(!value.value);
    trigger.addEventListener('click', onTriggerClick);
    trigger.addEventListener('keydown', onTriggerKeyDown);
    listbox.addEventListener('pointerdown', onListboxPointerDown);
    listbox.addEventListener('click', onListboxClick);
    listbox.addEventListener('beforetoggle', onBeforeToggle);
    value.addEventListener('input', syncFromValue);
    value.addEventListener('change', syncFromValue);
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
      value.removeEventListener('input', syncFromValue);
      value.removeEventListener('change', syncFromValue);
      form?.removeEventListener('reset', onFormReset);
      removeGeneratedMarkup?.();
      initializedSelects.delete(select);
    };

    initializedSelects.set(select, cleanup);
    initialized.push(cleanup);
  }

  return () => { for (const cleanup of initialized) cleanup(); };
}
