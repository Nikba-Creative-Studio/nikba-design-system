# Alert

## Purpose

Alert communicates contextual information, success, caution, or failure that remains relevant until the user reads it or resolves the condition.

Use Alert for persistent feedback within the page. Use transient notification patterns for brief confirmations that do not need to remain in the content flow. Validation errors should also appear beside their related fields.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-alert` | Required base class and neutral appearance |
| `.nds-alert--compact` | Reduces padding for dense layouts |
| `.nds-alert--info` | Informational tone |
| `.nds-alert--success` | Successful outcome or completed state |
| `.nds-alert--warning` | Caution or a condition that may require attention |
| `.nds-alert--danger` | Failure, blocked state, or serious consequence |
| `.nds-alert__icon` | Optional decorative tone icon |
| `.nds-alert__content` | Groups the title and description |
| `.nds-alert__title` | Concise summary of the message |
| `.nds-alert__description` | Supporting context and recovery guidance |
| `.nds-alert__actions` | Relevant links or Buttons |
| `.nds-alert__close` | Dismiss control with an accessible name |

## Tones

Neutral communicates general contextual information. Info highlights guidance or a notable change. Success confirms a completed outcome. Warning identifies a condition that may become a problem. Danger communicates failure, blocked progress, or a serious consequence.

Tone supports the written message and never replaces it. The title must remain understandable without color or icon recognition.

## Accessibility

Static Alerts that are present when the page loads do not need a live-region role. Use `role="status"` when non-urgent feedback appears dynamically and should be announced politely. Use `role="alert"` only for urgent dynamic information that requires immediate attention.

Do not add both `role="status"` and `aria-live`. The native role already supplies live-region behavior. Do not place interactive controls inside `role="alert"` when the resulting announcement would be unnecessarily disruptive.

Decorative icons use `aria-hidden="true"`. A dismiss control requires a specific accessible name such as “Dismiss upload warning.” When dismissal removes the focused control, move focus to the next logical control or content location.

## Content guidance

Lead with the outcome or condition. Keep the title short and use the description to explain impact or recovery. Action labels state what happens next, such as “Review billing” or “Try again.”

Avoid generic titles such as “Notice” and vague actions such as “OK.” Do not blame the user. Do not use success feedback for routine state changes that are already visually clear.

## Examples

Static informational Alert:

```html
<aside class="nds-alert nds-alert--info">
  <span class="nds-alert__icon" aria-hidden="true"><!-- Info icon --></span>
  <div class="nds-alert__content">
    <h2 class="nds-alert__title">Preview environment</h2>
    <p class="nds-alert__description">Changes here do not affect the published website.</p>
  </div>
</aside>
```

Dynamic success Status:

```html
<div class="nds-alert nds-alert--success" role="status">
  <span class="nds-alert__icon" aria-hidden="true"><!-- Success icon --></span>
  <div class="nds-alert__content">
    <p class="nds-alert__title">Changes saved</p>
  </div>
</div>
```

## Acceptance criteria

- Neutral, Info, Success, Warning, and Danger remain distinguishable in every theme.
- Titles communicate meaning without depending on color or icon recognition.
- Static Alerts do not create unnecessary live-region announcements.
- Dynamic non-urgent feedback uses Status semantics.
- Alert semantics are reserved for urgent dynamic feedback.
- Decorative icons remain hidden from the accessibility tree.
- Dismiss controls expose a specific accessible name and preserve a logical focus position.
- Actions remain understandable and keyboard accessible.
- Alert content wraps without horizontal overflow at 320px.
- Tone boundaries and focus remain visible in forced-colors mode.
