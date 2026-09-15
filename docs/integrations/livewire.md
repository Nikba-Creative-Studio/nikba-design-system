# Livewire Integration

Status: Validated for Livewire 3 DOM morphs and navigation  
Public JavaScript: `observeComponents(root?)`

## Setup

Import the public CSS in the Laravel Vite CSS entry. Start one component lifecycle observer in the JavaScript entry:

```js
import '@nikba/design-system/css';
import { observeComponents } from '@nikba/design-system';

const nikba = observeComponents();
document.addEventListener('livewire:navigated', () => nikba.refresh());
```

The observer initializes added interactive components and runs their cleanup before removed component roots are discarded. `refresh()` is safe after `livewire:navigated` because every initializer is idempotent. Call `nikba.disconnect()` only when the application shell itself is torn down.

## Ownership boundaries

Livewire owns server state and renders markup. Nikba owns local keyboard, focus, dismissal, sorting, selection, and validation behavior after that markup exists. Keep durable state such as selected records, saved settings, and active filters in Livewire. Use Nikba events to forward local interaction when server synchronization is required.

Add `wire:key` to repeated interactive roots so Livewire preserves identity. Use `wire:ignore` only for a subtree whose DOM another library fully owns; ordinary Nikba components do not require it. A modal may contain Livewire fields, but close it deliberately after the server confirms success rather than when the request starts.

## Validation scenarios

- An interactive root added by a morph initializes once.
- A removed root runs cleanup and can be garbage-collected.
- A replacement root receives fresh behavior without retaining listeners from the removed node.
- A navigation refresh does not duplicate behavior.
- Native HTML remains usable before the Livewire runtime and Nikba observer start.
