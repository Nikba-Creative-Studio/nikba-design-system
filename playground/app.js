import { createToastManager, glassLevels, initAccordions, initDialogs, initForms, initNavigations, initPopovers, initSelects, initTables, initTabs, initTooltips, setGlassLevel, setTheme, themes } from '../src/index.js';
import logoUrl from '../src/logo.svg?url';
import { componentCatalog } from './component-catalog.js';
import './styles.css';

const root = document.documentElement;
const themeKey = 'nds-catalog-theme';
const glassKey = 'nds-catalog-glass';
const catalogRelease = 'Alpha 02';

function readPreference(key, allowedValues, fallback) {
  try {
    const value = localStorage.getItem(key);
    return allowedValues.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

const currentSection = document.querySelector('[data-catalog-header]')?.dataset.current;
const navigationItems = [
  ['overview', '/', 'Overview'],
  ['foundations', '/foundations.html', 'Foundations'],
  ['components', '/components/', 'Components'],
  ['mcp', '/mcp.html', 'MCP'],
];

document.querySelector('[data-catalog-header]')?.replaceChildren(
  Object.assign(document.createElement('nav'), {
    className: 'catalog-nav',
    ariaLabel: 'Primary navigation',
    innerHTML: `
      <a class="wordmark" href="/" aria-label="Nikba home">
        <img src="${logoUrl}" width="102" height="34" alt="" />
      </a>
      <div class="catalog-nav__links">
        ${navigationItems
          .map(
            ([id, href, label]) =>
              `<a href="${href}"${id === currentSection ? ' aria-current="page"' : ''}>${label}</a>`,
          )
          .join('')}
      </div>
      <span class="release-badge">${catalogRelease}</span>
    `,
  }),
);

document.querySelector('[data-appearance-panel]')?.replaceChildren(
  Object.assign(document.createElement('div'), {
    className: 'lab-panel nds-glass',
    innerHTML: `
      <fieldset class="control-group">
        <legend>Theme</legend>
        <div class="segmented" data-theme-controls>
          <button type="button" data-value="frost">Frost</button>
          <button type="button" data-value="mist">Mist</button>
          <button type="button" data-value="graphite">Graphite</button>
        </div>
      </fieldset>
      <fieldset class="control-group">
        <legend>Glass</legend>
        <div class="segmented" data-glass-controls>
          <button type="button" data-value="off">Off</button>
          <button type="button" data-value="soft">Soft</button>
          <button type="button" data-value="clear">Clear</button>
        </div>
      </fieldset>
    `,
  }),
);

function enhanceNextComponentPreview() {
  const currentSlug = location.pathname.match(/\/components\/([^/]+)\.html$/)?.[1];
  const currentIndex = componentCatalog.findIndex(({ slug }) => slug === currentSlug);
  const link = document.querySelector('.guidance-panel .nds-link[href]');
  if (currentIndex < 0 || !link) return;

  const nextItem = componentCatalog[(currentIndex + 1) % componentCatalog.length];
  const label = document.createElement('span');
  const body = document.createElement('span');
  const title = document.createElement('strong');
  const description = document.createElement('span');
  const arrow = document.createElement('span');

  label.className = 'component-next-preview__label';
  label.textContent = `Next ${nextItem.type === 'pattern' ? 'pattern' : 'component'}`;
  body.className = 'component-next-preview__body';
  title.textContent = nextItem.title;
  description.textContent = nextItem.description;
  arrow.className = 'component-next-preview__arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  body.append(title, description);

  link.href = `/components/${nextItem.slug}.html`;
  link.className = 'component-next-preview';
  link.replaceChildren(label, body, arrow);
}

enhanceNextComponentPreview();

function updatePressedState(selector, value) {
  document.querySelectorAll(`${selector} button`).forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.value === value));
  });
}

function applyTheme(theme) {
  setTheme(theme);
  updatePressedState('[data-theme-controls]', theme);
  writePreference(themeKey, theme);
}

function applyGlass(level) {
  setGlassLevel(level);
  updatePressedState('[data-glass-controls]', level);
  document.querySelectorAll('[data-glass-label]').forEach((label) => {
    label.textContent = level.charAt(0).toUpperCase() + level.slice(1);
  });
  writePreference(glassKey, level);
}

applyTheme(readPreference(themeKey, themes, root.dataset.theme || 'frost'));
applyGlass(readPreference(glassKey, glassLevels, root.dataset.glass || 'soft'));
initAccordions();
initTabs();
initDialogs();
initPopovers();
initSelects();
initTooltips();
initNavigations();
initTables();
initForms();

document.querySelectorAll('[data-table-output]').forEach((output) => {
  const table = document.getElementById(output.dataset.tableOutput);
  table?.addEventListener('nds:table-sort', (event) => {
    output.textContent = `${event.detail.key} · ${event.detail.direction}`;
  });
  table?.addEventListener('nds:table-selection-change', (event) => {
    output.textContent = `${event.detail.selected.length} selected`;
  });
});

document.querySelectorAll('[data-filter-demo]').forEach((demo) => {
  const form = demo.querySelector('form');
  const results = demo.querySelector('[data-filter-results]');
  const count = demo.querySelector('[data-filter-count]');
  const active = demo.querySelector('[data-filter-active]');
  const empty = demo.querySelector('[data-filter-empty]');
  if (!form || !results || !count || !active || !empty) return;

  const items = [...results.querySelectorAll('[data-filter-item]')];
  const filterLabels = { query: 'Search', status: 'Status', type: 'Type' };

  const update = () => {
    const values = Object.fromEntries(new FormData(form));
    const query = String(values.query || '').trim().toLocaleLowerCase();
    const visibleItems = items.filter((item) => {
      const matchesQuery = !query || item.textContent.toLocaleLowerCase().includes(query);
      const matchesStatus = !values.status || item.dataset.status === values.status;
      const matchesType = !values.type || item.dataset.type === values.type;
      item.hidden = !(matchesQuery && matchesStatus && matchesType);
      return !item.hidden;
    });

    count.textContent = `${visibleItems.length} ${visibleItems.length === 1 ? 'result' : 'results'}`;
    empty.hidden = visibleItems.length > 0;
    results.hidden = visibleItems.length === 0;
    active.replaceChildren();

    Object.entries(values).filter(([, value]) => value).forEach(([key, value]) => {
      const control = form.elements.namedItem(key);
      const displayValue = control instanceof HTMLSelectElement
        ? control.selectedOptions[0]?.textContent.trim() || value
        : value;
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.className = 'nds-chip';
      button.type = 'button';
      button.textContent = `${filterLabels[key]}: ${displayValue} ×`;
      button.setAttribute('aria-label', `Remove ${filterLabels[key]} filter: ${displayValue}`);
      button.addEventListener('click', () => {
        if (control) {
          control.value = '';
          control.dispatchEvent(new Event('change', { bubbles: true }));
        }
        update();
      });
      item.append(button);
      active.append(item);
    });
  };

  form.addEventListener('submit', (event) => { event.preventDefault(); update(); });
  form.addEventListener('reset', () => queueMicrotask(update));
  demo.querySelector('[data-filter-reset]')?.addEventListener('click', () => { form.reset(); queueMicrotask(update); });
  update();
});

document.querySelectorAll('[data-form-demo]').forEach((form) => {
  const submit = form.querySelector('[data-form-submit]');
  const status = form.querySelector('[data-form-status]');
  const success = form.querySelector('[data-form-success]');

  form.addEventListener('submit', (event) => {
    if (event.defaultPrevented) return;
    event.preventDefault();
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    status.textContent = 'Saving profile…';
    if (success) success.hidden = true;

    window.setTimeout(() => {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      status.textContent = '';
      if (success) success.hidden = false;
    }, 700);
  });

  form.addEventListener('reset', () => {
    status.textContent = '';
    if (success) success.hidden = true;
  });
});

document.querySelectorAll('[data-confirm-demo]').forEach((demo) => {
  const dialog = document.getElementById('delete-project-dialog');
  const input = dialog?.querySelector('[data-confirm-input]');
  const submit = dialog?.querySelector('[data-confirm-submit]');
  const cancel = dialog?.querySelector('[data-nds-dialog-initial-focus]');
  const subject = demo.querySelector('[data-confirm-subject]');
  const success = demo.querySelector('[data-confirm-success]');
  if (!dialog || !input || !submit || !cancel || !subject || !success) return;

  input.addEventListener('input', () => { submit.disabled = input.value.trim() !== 'Aurora'; });
  dialog.addEventListener('nds:dialog-open', () => {
    input.value = '';
    submit.disabled = true;
    submit.removeAttribute('aria-busy');
    cancel.disabled = false;
  });
  submit.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    if (submit.disabled) return;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    cancel.disabled = true;
    window.setTimeout(() => {
      dialog.close('delete');
      subject.hidden = true;
      success.hidden = false;
      submit.removeAttribute('aria-busy');
      cancel.disabled = false;
    }, 700);
  }, { capture: true });
});

document.querySelectorAll('[data-toast-demo-region]').forEach((region) => {
  const manager = createToastManager(region, { maxVisible: 3, duration: 6000 });
  document.querySelectorAll(`[data-toast-region="${region.id}"]`).forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.toastDismissAll === 'true') {
        manager.dismissAll();
        return;
      }
      manager.show({
        title: button.dataset.toastTitle,
        message: button.dataset.toastMessage,
        tone: button.dataset.toastTone,
        duration: button.dataset.toastPersistent === 'true' ? 0 : undefined,
        action: button.dataset.toastAction ? { label: button.dataset.toastAction } : undefined,
      });
    });
  });
});

document.querySelectorAll('[data-accordion-output]').forEach((output) => {
  document.getElementById(output.dataset.accordionOutput)?.addEventListener('nds:accordion-change', (event) => {
    output.textContent = event.detail.openItem.querySelector('.nds-disclosure__heading')?.firstChild?.textContent?.trim() || 'Item';
  });
});

document.querySelectorAll('[data-tabs-output]').forEach((output) => {
  document.getElementById(output.dataset.tabsOutput)?.addEventListener('nds:tabs-change', (event) => {
    output.textContent = event.detail.tab.textContent.trim();
  });
});

document.querySelectorAll('[data-menu-output]').forEach((output) => {
  document.getElementById(output.dataset.menuOutput)?.addEventListener('nds:menu-select', (event) => {
    output.textContent = event.detail.item.textContent.trim();
  });
});

document.querySelector('[data-theme-controls]')?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-value]');
  if (button) applyTheme(button.dataset.value);
});

document.querySelector('[data-glass-controls]')?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-value]');
  if (button) applyGlass(button.dataset.value);
});

document.querySelectorAll('[data-toggle-button]').forEach((button) => {
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
  });
});

document.querySelectorAll('[data-character-input]').forEach((control) => {
  const counter = document.querySelector(`[data-character-count="${control.id}"]`);
  if (!counter) return;

  const updateCharacterCount = () => {
    const limit = control.maxLength;
    const current = control.value.length;
    const nearLimit = limit > 0 && current >= limit * 0.9;
    const atLimit = limit > 0 && current >= limit;

    counter.textContent = `${current} / ${limit}`;
    counter.dataset.limitNear = String(nearLimit && !atLimit);
    counter.dataset.limitReached = String(atLimit);
    counter.setAttribute('aria-live', nearLimit ? 'polite' : 'off');
  };

  updateCharacterCount();
  control.addEventListener('input', updateCharacterCount);
});

document.querySelectorAll('[data-checkbox-group]').forEach((group) => {
  const master = group.querySelector('[data-checkbox-master]');
  const items = [...group.querySelectorAll('[data-checkbox-item]')];
  if (!master || items.length === 0) return;

  const updateMaster = () => {
    const selectedCount = items.filter((item) => item.checked).length;
    master.checked = selectedCount === items.length;
    master.indeterminate = selectedCount > 0 && selectedCount < items.length;
  };

  master.addEventListener('change', () => {
    items.forEach((item) => {
      item.checked = master.checked;
    });
    updateMaster();
  });

  items.forEach((item) => item.addEventListener('change', updateMaster));
  updateMaster();
});

document.querySelectorAll('[data-alert-demo]').forEach((demo) => {
  const dismissButton = demo.querySelector('[data-alert-dismiss]');
  const restoreButton = demo.querySelector('[data-alert-restore]');
  const announcer = demo.querySelector('[data-alert-announcer]');
  if (!dismissButton || !restoreButton) return;

  const alert = document.getElementById(dismissButton.dataset.alertDismiss);
  if (!alert) return;

  dismissButton.addEventListener('click', () => {
    alert.hidden = true;
    restoreButton.disabled = false;
    if (announcer) announcer.textContent = 'Notification dismissed.';
    restoreButton.focus();
  });

  restoreButton.addEventListener('click', () => {
    alert.hidden = false;
    restoreButton.disabled = true;
    if (announcer) announcer.textContent = 'Notification shown.';
    dismissButton.focus();
  });
});

const catalogNav = document.querySelector('.catalog-nav');
const updateNavigationSurface = () => catalogNav?.classList.toggle('is-scrolled', scrollY > 12);
updateNavigationSurface();
addEventListener('scroll', updateNavigationSurface, { passive: true });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}
