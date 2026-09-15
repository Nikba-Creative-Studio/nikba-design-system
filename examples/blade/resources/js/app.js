import { observeComponents } from '@nikba/design-system';

const nikba = observeComponents();

document.addEventListener('livewire:navigated', () => nikba.refresh());
