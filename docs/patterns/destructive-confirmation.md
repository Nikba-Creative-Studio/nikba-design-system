# Modal and Destructive-Action Confirmation

Status: Complete  
Public CSS: `.nds-confirmation`, `.nds-confirmation__subject`, `.nds-confirmation__subject-copy`, `.nds-confirmation__consequences`, `.nds-confirmation__verify`  
Composes: Dialog, Button, Field, Input, Alert

## Purpose

Use this pattern immediately before a destructive action whose effect is difficult or impossible to reverse. The confirmation names the action and target, states concrete consequences, offers a safe initial focus, and protects the pending request from duplication.

## Decision levels

- Skip confirmation for easily reversible removal. Perform the action and offer Undo.
- Use a two-action Dialog when the target and consequence are clear and recovery is limited.
- Require typed verification for permanent account deletion, broad data loss, or actions with a similarly large scope.

## Contract

Use the public native Dialog contract. The safe action comes first in source and visual order and receives initial focus. The destructive button repeats the exact action label. Do not use ambiguous labels such as Yes or Continue.

Typed verification must state the exact text to enter, compare it predictably, and keep confirmation disabled until it matches. It supplements the consequence explanation; it does not replace it.

## Submission lifecycle

On confirmation, disable dismissal controls that would make request state ambiguous, set `aria-busy="true"` on the destructive button, and submit once. On failure, keep the Dialog open, preserve context, and show a persistent actionable error. On success, close the Dialog, restore or deliberately place focus, update the view, and announce the outcome.

## Accessibility

Reference the title and consequence text with `aria-labelledby` and `aria-describedby`. Initial focus belongs on the safe action. Escape closes before submission begins. Never communicate danger by color alone. The title, copy, and button must each name the destructive outcome.
