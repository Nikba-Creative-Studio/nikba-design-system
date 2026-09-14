const initializedNavigations = new WeakMap();

function findNavigations(root) {
  const navigations = [...root.querySelectorAll('[data-nds-navigation]')];
  if (root.matches?.('[data-nds-navigation]')) navigations.unshift(root);
  return navigations;
}

export function initNavigations(root = document) {
  const initialized = [];

  for (const navigation of findNavigations(root)) {
    if (initializedNavigations.has(navigation) || !navigation.id) continue;

    const ownerDocument = navigation.ownerDocument;
    const header = navigation.closest('.nds-header') ?? navigation.parentElement;
    const trigger = [...ownerDocument.querySelectorAll('[data-nds-navigation-trigger][aria-controls]')]
      .find((candidate) => candidate.getAttribute('aria-controls') === navigation.id);
    if (!trigger || !header) continue;

    const view = ownerDocument.defaultView;
    const desktopQuery = view?.matchMedia?.('(min-width: 48.0625rem)');
    header.dataset.ndsEnhanced = 'true';

    const setOpen = (open, restoreFocus = false) => {
      navigation.dataset.open = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      if (open) ownerDocument.addEventListener('pointerdown', onDocumentPointerDown, true);
      else ownerDocument.removeEventListener('pointerdown', onDocumentPointerDown, true);
      if (restoreFocus) trigger.focus();
      navigation.dispatchEvent(new CustomEvent('nds:navigation-change', { bubbles: true, detail: { open } }));
    };

    const onDocumentPointerDown = (event) => {
      if (!header.contains(event.target)) setOpen(false);
    };

    const onTriggerClick = () => setOpen(navigation.dataset.open !== 'true');
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || navigation.dataset.open !== 'true') return;
      event.preventDefault();
      setOpen(false, true);
    };
    const onNavigationClick = (event) => {
      if (event.target.closest?.('a[href]')) setOpen(false);
    };
    const onBreakpointChange = (event) => {
      if (event.matches) setOpen(false);
    };

    trigger.setAttribute('aria-expanded', 'false');
    navigation.dataset.open = 'false';
    trigger.addEventListener('click', onTriggerClick);
    header.addEventListener('keydown', onKeyDown);
    navigation.addEventListener('click', onNavigationClick);
    desktopQuery?.addEventListener('change', onBreakpointChange);

    const cleanup = () => {
      ownerDocument.removeEventListener('pointerdown', onDocumentPointerDown, true);
      trigger.removeEventListener('click', onTriggerClick);
      header.removeEventListener('keydown', onKeyDown);
      navigation.removeEventListener('click', onNavigationClick);
      desktopQuery?.removeEventListener('change', onBreakpointChange);
      delete header.dataset.ndsEnhanced;
      delete navigation.dataset.open;
      trigger.removeAttribute('aria-expanded');
      initializedNavigations.delete(navigation);
    };

    initializedNavigations.set(navigation, cleanup);
    initialized.push(cleanup);
  }

  return () => {
    for (const cleanup of initialized) cleanup();
  };
}
