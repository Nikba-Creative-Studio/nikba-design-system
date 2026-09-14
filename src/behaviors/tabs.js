const initializedTabGroups = new WeakMap();

function findTabGroups(root) {
  const groups = [...root.querySelectorAll('[data-nds-tabs]')];
  if (root.matches?.('[data-nds-tabs]')) groups.unshift(root);
  return groups;
}

function enabledTabs(tabs) {
  return tabs.filter((tab) => tab.getAttribute('aria-disabled') !== 'true' && !tab.disabled);
}

export function initTabs(root = document) {
  const initialized = [];

  for (const group of findTabGroups(root)) {
    if (initializedTabGroups.has(group)) continue;

    const tablist = group.querySelector('[role="tablist"]');
    if (!tablist) continue;

    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = new Map(
      tabs.map((tab) => [tab, group.ownerDocument.getElementById(tab.getAttribute('aria-controls'))])
    );
    const availableTabs = enabledTabs(tabs);
    if (availableTabs.length === 0) continue;

    const activate = (nextTab, focus = false) => {
      if (!availableTabs.includes(nextTab)) return;

      for (const tab of tabs) {
        const selected = tab === nextTab;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        const panel = panels.get(tab);
        if (panel) panel.hidden = !selected;
      }

      if (focus) nextTab.focus();
      group.dispatchEvent(
        new CustomEvent('nds:tabs-change', {
          bubbles: true,
          detail: { tab: nextTab, panel: panels.get(nextTab) ?? null }
        })
      );
    };

    const selectedTab = availableTabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? availableTabs[0];
    for (const tab of tabs) {
      const selected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels.get(tab);
      if (panel) panel.hidden = !selected;
    }

    const onClick = (event) => {
      const tab = event.target.closest?.('[role="tab"]');
      if (tab && tabs.includes(tab)) activate(tab);
    };

    const onKeyDown = (event) => {
      const currentTab = event.target.closest?.('[role="tab"]');
      if (!currentTab || !availableTabs.includes(currentTab)) return;

      const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
      const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
      let nextTab;

      if (event.key === previousKey || event.key === nextKey) {
        const direction = event.key === nextKey ? 1 : -1;
        const index = availableTabs.indexOf(currentTab);
        nextTab = availableTabs[(index + direction + availableTabs.length) % availableTabs.length];
      } else if (event.key === 'Home') {
        nextTab = availableTabs[0];
      } else if (event.key === 'End') {
        nextTab = availableTabs.at(-1);
      } else if ((event.key === 'Enter' || event.key === ' ') && group.dataset.activation === 'manual') {
        event.preventDefault();
        activate(currentTab);
        return;
      } else {
        return;
      }

      event.preventDefault();
      if (group.dataset.activation === 'manual') {
        currentTab.tabIndex = -1;
        nextTab.tabIndex = 0;
        nextTab.focus();
      } else {
        activate(nextTab, true);
      }
    };

    tablist.addEventListener('click', onClick);
    tablist.addEventListener('keydown', onKeyDown);

    const cleanup = () => {
      tablist.removeEventListener('click', onClick);
      tablist.removeEventListener('keydown', onKeyDown);
      initializedTabGroups.delete(group);
    };

    initializedTabGroups.set(group, cleanup);
    initialized.push(cleanup);
  }

  return () => {
    for (const cleanup of initialized) cleanup();
  };
}
