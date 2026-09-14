const initializedTooltips = new WeakMap();

function findTooltips(root) {
  const tooltips = [...root.querySelectorAll('[data-nds-tooltip]')];
  if (root.matches?.('[data-nds-tooltip]')) tooltips.unshift(root);
  return tooltips;
}

function placeTooltip(tooltip, trigger) {
  const view = tooltip.ownerDocument.defaultView;
  if (!view) return;

  const margin = 8;
  const gap = 8;
  const triggerBounds = trigger.getBoundingClientRect();
  const tooltipBounds = tooltip.getBoundingClientRect();
  const preferredBottom = tooltip.dataset.placement === 'bottom';
  const spaceAbove = triggerBounds.top - gap;
  const spaceBelow = view.innerHeight - triggerBounds.bottom - gap;
  const placeBelow = preferredBottom ? spaceBelow >= tooltipBounds.height || spaceBelow >= spaceAbove : spaceAbove < tooltipBounds.height && spaceBelow > spaceAbove;
  let top = placeBelow ? triggerBounds.bottom + gap : triggerBounds.top - tooltipBounds.height - gap;
  let left = triggerBounds.left + (triggerBounds.width - tooltipBounds.width) / 2;

  top = Math.min(Math.max(margin, top), view.innerHeight - tooltipBounds.height - margin);
  left = Math.min(Math.max(margin, left), view.innerWidth - tooltipBounds.width - margin);
  tooltip.style.top = `${Math.round(top)}px`;
  tooltip.style.left = `${Math.round(left)}px`;
  tooltip.dataset.resolvedPlacement = placeBelow ? 'bottom' : 'top';
}

export function initTooltips(root = document) {
  const initialized = [];

  for (const tooltip of findTooltips(root)) {
    if (initializedTooltips.has(tooltip) || !tooltip.id) continue;

    const ownerDocument = tooltip.ownerDocument;
    const view = ownerDocument.defaultView;
    const triggers = [...ownerDocument.querySelectorAll('[data-nds-tooltip-trigger]')]
      .filter((trigger) => trigger.dataset.ndsTooltipTrigger === tooltip.id);
    if (triggers.length === 0) continue;

    const originalDescriptions = new Map();
    let activeTrigger = triggers[0];
    let hovered = false;
    let focused = false;
    let showTimer;

    const updatePlacement = () => {
      if (!tooltip.hidden) placeTooltip(tooltip, activeTrigger);
    };

    const show = (trigger) => {
      clearTimeout(showTimer);
      activeTrigger = trigger;
      const delay = Number(trigger.dataset.tooltipDelay ?? 300);
      showTimer = setTimeout(() => {
        tooltip.hidden = false;
        placeTooltip(tooltip, trigger);
        view?.addEventListener('resize', updatePlacement);
        view?.addEventListener('scroll', updatePlacement, true);
        tooltip.dispatchEvent(new CustomEvent('nds:tooltip-show', { bubbles: true, detail: { trigger } }));
      }, Number.isFinite(delay) ? Math.max(0, delay) : 300);
    };

    const hide = (force = false) => {
      clearTimeout(showTimer);
      if (!force && (hovered || focused)) return;
      if (tooltip.hidden) return;
      tooltip.hidden = true;
      view?.removeEventListener('resize', updatePlacement);
      view?.removeEventListener('scroll', updatePlacement, true);
      tooltip.dispatchEvent(new CustomEvent('nds:tooltip-hide', { bubbles: true, detail: { trigger: activeTrigger } }));
    };

    const triggerListeners = triggers.map((trigger) => {
      const previousDescription = trigger.getAttribute('aria-describedby');
      originalDescriptions.set(trigger, previousDescription);
      const descriptions = new Set((previousDescription ?? '').split(/\s+/).filter(Boolean));
      descriptions.add(tooltip.id);
      trigger.setAttribute('aria-describedby', [...descriptions].join(' '));

      const onPointerEnter = () => { hovered = true; show(trigger); };
      const onPointerLeave = () => { hovered = false; hide(); };
      const onFocusIn = () => { focused = true; show(trigger); };
      const onFocusOut = () => { focused = false; hide(); };
      const onKeyDown = (event) => {
        if (event.key !== 'Escape' || tooltip.hidden) return;
        event.preventDefault();
        hovered = false;
        focused = false;
        hide(true);
      };

      trigger.addEventListener('pointerenter', onPointerEnter);
      trigger.addEventListener('pointerleave', onPointerLeave);
      trigger.addEventListener('focusin', onFocusIn);
      trigger.addEventListener('focusout', onFocusOut);
      trigger.addEventListener('keydown', onKeyDown);
      return [trigger, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, onKeyDown];
    });

    tooltip.hidden = true;

    const cleanup = () => {
      clearTimeout(showTimer);
      view?.removeEventListener('resize', updatePlacement);
      view?.removeEventListener('scroll', updatePlacement, true);
      for (const [trigger, onPointerEnter, onPointerLeave, onFocusIn, onFocusOut, onKeyDown] of triggerListeners) {
        trigger.removeEventListener('pointerenter', onPointerEnter);
        trigger.removeEventListener('pointerleave', onPointerLeave);
        trigger.removeEventListener('focusin', onFocusIn);
        trigger.removeEventListener('focusout', onFocusOut);
        trigger.removeEventListener('keydown', onKeyDown);
        const originalDescription = originalDescriptions.get(trigger);
        if (originalDescription === null) trigger.removeAttribute('aria-describedby');
        else trigger.setAttribute('aria-describedby', originalDescription);
      }
      tooltip.hidden = true;
      initializedTooltips.delete(tooltip);
    };

    initializedTooltips.set(tooltip, cleanup);
    initialized.push(cleanup);
  }

  return () => {
    for (const cleanup of initialized) cleanup();
  };
}
