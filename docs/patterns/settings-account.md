# Settings and Account

Status: Complete  
Public CSS: `.nds-settings`, `.nds-settings__nav`, `.nds-settings__nav-list`, `.nds-settings__nav-link`, `.nds-settings__content`, `.nds-settings__section`, `.nds-settings__heading`, `.nds-settings__profile`, `.nds-settings__row`

## Purpose

Use this pattern for a signed-in person's profile, preferences, security sessions, and account-level actions. The layout makes scope visible: local preferences use immediate Switches, edited data uses explicit save actions, and consequential account operations remain separated.

## Structure

Use a labeled navigation landmark for settings categories and one main content column. Each section has one heading, a short consequence-oriented description, and related controls. Anchor navigation is a resilient baseline; applications may map the same structure to routes.

## Interaction rules

- Use a Switch only when a setting takes effect immediately. Announce a failed update and restore the previous value.
- Use a form and explicit Save action when several fields form one transaction.
- Describe sessions with device, approximate location, and recent activity before offering Sign out.
- Put destructive account actions in a distinct final section. Explain consequences before opening a confirmation Dialog.
- Preserve unsaved edits if submission fails. Warn about unsaved changes only when leaving would lose meaningful work.

## Responsive behavior

The category navigation becomes a horizontally scrollable list below `48rem`. Content keeps its source order. Rows stack below `36rem`, and their actions become full width.

## Accessibility

Use native headings, landmarks, forms, and controls. Mark the current category with `aria-current="page"`. Do not encode setting state in supporting text; the control exposes it. Give session actions a name that includes their device when multiple sessions are shown.
