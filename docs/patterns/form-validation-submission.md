# Form Validation and Submission

Status: Complete  
Public CSS: `.nds-form`, `.nds-form__section`, `.nds-form__legend`, `.nds-form__grid`, `.nds-form__full`, `.nds-form__actions`, `.nds-form__status`, `.nds-error-summary`  
Public JavaScript: `initForms(root?)`

## Purpose

Use this pattern for forms that collect related data, validate it, submit it, and report a recoverable outcome. Native constraints and submission remain the baseline. The initializer adds inline error synchronization, an error-summary focus target, lifecycle events, and cleanup.

## Contract

Add `data-nds-form` to the form. Give each invalidatable control a stable `name`, a label, native constraints, and an error element whose `data-nds-error` value matches that name. Reference helper and error text with `aria-describedby`. An optional `[data-nds-error-summary]` receives focus after an invalid submission.

```html
<form class="nds-form" method="post" data-nds-form>
  <div class="nds-error-summary" data-nds-error-summary tabindex="-1" hidden>
    <h2 class="nds-error-summary__title">Check the highlighted fields</h2>
  </div>
  <label class="nds-field">
    <span class="nds-field__label">Email <span class="nds-field__required">*</span></span>
    <input class="nds-input" id="email" name="email" type="email" required aria-describedby="email-error" />
    <span class="nds-field__error" id="email-error" data-nds-error="email" hidden>Enter a valid email address.</span>
  </label>
  <div class="nds-form__actions"><button class="nds-button" type="submit">Save profile</button></div>
</form>
```

Call `initForms()` after rendering. It is idempotent and returns cleanup. Invalid submission is prevented and emits `nds:form-invalid` with `detail.invalidControls`. Valid submission follows native browser behavior and emits `nds:form-valid` with `detail.submitter`. Applications own transport, server-error mapping, and success navigation.

## Submission states

- Keep the submit label specific to the outcome.
- Set `aria-busy="true"` on the submit button and disable duplicate submission while pending.
- Keep entered values after transport or server validation failure.
- Put field-specific server errors beside their fields and include them in the summary.
- Use a persistent Alert or inline Status for failure. Announce successful in-place updates with `role="status"`; navigate to a confirmation page for completed multi-step tasks.

## Accessibility

Errors must explain how to recover. Do not rely on color. Preserve native `required`, input types, and autocomplete tokens. Move focus to the summary after an invalid submission so keyboard and screen-reader users encounter the problem before continuing. The unenhanced form keeps native constraint validation and submission.

## Responsive behavior

Two-column field groups collapse to one column below `43.75rem`. Actions become full width. Keep source order identical to reading and tab order.
