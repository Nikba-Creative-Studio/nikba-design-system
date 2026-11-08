# Combobox

Apply `data-nds-combobox` to a labeled native select and call `initComboboxes(root)`. Returns an idempotent cleanup function. The native select owns submission, required validation, and form reset. Typing filters available options; Arrow keys move, Enter chooses, Escape cancels. Uncommitted text restores the selected label on blur. Disabled options are excluded. The native select remains available without JavaScript.
