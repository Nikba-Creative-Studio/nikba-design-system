const initializedForms = new WeakMap();

function findForms(root) {
  const forms = [...root.querySelectorAll('[data-nds-form]')];
  if (root.matches?.('[data-nds-form]')) forms.unshift(root);
  return forms;
}

function controlsFor(form) {
  return [...form.querySelectorAll('input, select, textarea')].filter((control) => control.name && !control.disabled);
}

function errorFor(form, control) {
  return [...form.querySelectorAll('[data-nds-error]')]
    .find((error) => error.dataset.ndsError === control.name);
}

function syncControl(form, control) {
  const invalid = control.validity ? !control.validity.valid : false;
  const error = errorFor(form, control);
  if (invalid) control.setAttribute('aria-invalid', 'true');
  else control.removeAttribute('aria-invalid');
  if (error) error.hidden = !invalid;
  return invalid;
}

function syncSummary(form, summary, controls) {
  if (!summary) return;
  let hasInvalid = false;
  for (const link of summary.querySelectorAll('a[href^="#"]')) {
    const id = link.getAttribute('href').slice(1);
    const control = controls.find((candidate) => candidate.id === id);
    const invalid = control?.validity ? !control.validity.valid : false;
    const item = link.closest('li');
    if (item) item.hidden = !invalid;
    hasInvalid ||= invalid;
  }
  summary.hidden = !hasInvalid;
}

export function initForms(root = document) {
  const initialized = [];

  for (const form of findForms(root)) {
    if (initializedForms.has(form)) continue;

    const previousNoValidate = form.noValidate;
    const summary = form.querySelector('[data-nds-error-summary]');
    form.noValidate = true;

    const onSubmit = (event) => {
      const controls = controlsFor(form);
      const invalidControls = controls.filter((control) => syncControl(form, control));
      syncSummary(form, summary, controls);
      if (invalidControls.length === 0) {
        if (summary) summary.hidden = true;
        form.dispatchEvent(new CustomEvent('nds:form-valid', {
          bubbles: true,
          detail: { submitter: event.submitter ?? null },
        }));
        return;
      }

      event.preventDefault();
      if (summary) {
        summary.hidden = false;
        summary.focus();
      } else {
        invalidControls[0].focus();
      }
      form.dispatchEvent(new CustomEvent('nds:form-invalid', {
        bubbles: true,
        detail: { invalidControls },
      }));
    };

    const onInput = (event) => {
      const control = event.target;
      if (!control.matches?.('input, select, textarea')) return;
      syncControl(form, control);
      syncSummary(form, summary, controlsFor(form));
    };

    const onReset = () => queueMicrotask(() => {
      controlsFor(form).forEach((control) => {
        control.removeAttribute('aria-invalid');
        const error = errorFor(form, control);
        if (error) error.hidden = true;
      });
      summary?.querySelectorAll('li').forEach((item) => { item.hidden = false; });
      if (summary) summary.hidden = true;
    });

    form.addEventListener('submit', onSubmit);
    form.addEventListener('input', onInput);
    form.addEventListener('change', onInput);
    form.addEventListener('reset', onReset);

    const cleanup = () => {
      form.removeEventListener('submit', onSubmit);
      form.removeEventListener('input', onInput);
      form.removeEventListener('change', onInput);
      form.removeEventListener('reset', onReset);
      form.noValidate = previousNoValidate;
      initializedForms.delete(form);
    };

    initializedForms.set(form, cleanup);
    initialized.push(cleanup);
  }

  return () => initialized.forEach((cleanup) => cleanup());
}
