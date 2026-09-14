const initializedAccordions = new WeakMap();

function findAccordions(root) {
  const accordions = [...root.querySelectorAll('[data-nds-accordion="single"]')];
  if (root.matches?.('[data-nds-accordion="single"]')) accordions.unshift(root);
  return accordions;
}

export function initAccordions(root = document) {
  const initialized = [];

  for (const accordion of findAccordions(root)) {
    if (initializedAccordions.has(accordion)) continue;

    const items = [...accordion.querySelectorAll(':scope > .nds-disclosure')];
    const onToggle = (event) => {
      const openItem = event.currentTarget;
      if (!openItem.open) return;

      for (const item of items) {
        if (item !== openItem) item.open = false;
      }

      accordion.dispatchEvent(
        new CustomEvent('nds:accordion-change', {
          bubbles: true,
          detail: { openItem }
        })
      );
    };

    for (const item of items) item.addEventListener('toggle', onToggle);

    const cleanup = () => {
      for (const item of items) item.removeEventListener('toggle', onToggle);
      initializedAccordions.delete(accordion);
    };

    initializedAccordions.set(accordion, cleanup);
    initialized.push(cleanup);
  }

  return () => {
    for (const cleanup of initialized) cleanup();
  };
}
