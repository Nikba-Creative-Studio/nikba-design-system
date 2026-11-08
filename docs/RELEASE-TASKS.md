# Release completion tasks

- [x] Combobox: adaptive popup, touch selection, disabled synchronization, reset and cleanup.
- [x] Multi-select: removable chips, clear action, empty/disabled/required states.
- [x] Data Table: page selection, persistent selection, bulk action event, empty recovery.
- [x] Regression scenarios in Chromium, Firefox and WebKit at compact and desktop sizes.
- [x] Update catalog, contracts, MCP documentation and bundle verification.
- [x] Final package/Pages checks and separate component commits.
- [ ] Manual VoiceOver/Safari, NVDA and physical iPhone verification (external evidence required).

## Verification evidence

- Chromium, Firefox and WebKit scenarios passed at 390, 776 and 1280 CSS pixels.
- Release verification passed with zero dependency advisories.
- Pages artifact contains all 35 catalog pages.
- Native form validation is retained; screen-reader usability and physical touch-device acceptance still require manual verification.
- Changes are committed locally; npm publication and remote deployment are separate release steps.

## Mobile acceptance pass

- [x] WebKit iPhone emulation: tap option, remove chip, persist page selection and emit bulk action across Frost/Mist/Graphite.
- [x] No horizontal overflow in these nine automated scenarios.
- [x] Manual task matrix published in MANUAL-ACCEPTANCE.md.
- [ ] Physical-device and screen-reader results: pending; simulator blocked by system account prompt.
