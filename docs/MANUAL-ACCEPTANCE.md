# Manual release acceptance

Automated responsive and browser checks do not establish screen-reader or physical-device acceptance. Record actual device, browser, OS, assistive technology, version, result and issue reference for each scenario.

## Required environments

- [ ] Safari with VoiceOver on macOS.
- [ ] Chrome or Firefox with NVDA on Windows.
- [ ] Safari on a physical iPhone, portrait and landscape, with VoiceOver.
- [ ] Browser zoom at 200% and 400%, including keyboard focus and overlays.

## Combobox

- Reach the control through its label and keyboard; hear its name, required/invalid state and help.
- Enter a query, hear available options, navigate with both arrow directions and select with Enter.
- Confirm selected option announcements, Escape cancellation and Tab exit.
- Select by touch with the software keyboard visible; confirm the list stays reachable near viewport edges.
- Submit an empty required value; focus must reach the visible control. Correct it and resubmit.
- Reset the form; verify original value. Disable the control; verify it cannot be edited.

## Multi-select

- Hear the group legend, search label, option names and checked states.
- Select several choices, filter the list, and verify prior choices remain selected.
- Reach each removal chip and remove a choice; focus must remain usable.
- Clear all and reset; verify disabled choices retain their prescribed state.
- Submit the form and confirm every selected value is represented.
- Confirm empty-search feedback is understandable and no selection is silently lost.

## Data Table

- Navigate the caption, headers and cells using screen-reader table commands.
- Sort, then filter and paginate; verify row order and result announcements.
- Select the current page; confirm mixed state after deselecting one row.
- Change pages and filters; confirm selection persists and its scope is clear.
- Trigger the bulk action; verify the application receives exactly the selected identifiers.
- Search for a missing value; hear the empty state and recover by clearing search.

## Current execution boundary

The booted iOS simulator was blocked by an Apple Account system prompt during inspection. No physical iPhone, NVDA session or verified VoiceOver interaction was available through the current automation interfaces. These checks remain pending; emulator screenshots must not be recorded as physical-device acceptance.

For reproducible WebKit touch emulation, start the catalog on port 4199, create artifacts/release, then run node tests/mobile-release.test.mjs.
