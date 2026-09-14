# Nikba Design System

Un sistem de design public pentru interfețe neutre, clare și funcționale, construit cu Onest și glassmorphism CSS performant.

> Status: `0.1.0-alpha.1` — explorare activă.

## Principii

- Onest este fontul unic.
- Conținutul rămâne mai important decât efectul.
- Glassmorphism apare selectiv pe navigație și controale.
- Componentele sunt accesibile și au fallback fără blur.
- Sistemul este independent de framework și poate fi folosit în Laravel, Blade, Livewire sau Filament.

## Structură

```text
src/
├── index.css
├── index.js
└── styles/
    ├── tokens.css
    ├── foundations.css
    ├── glass.css
    ├── button.css
    ├── tag.css
    └── field.css

playground/
└── laboratorul vizual
```

## Dezvoltare

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Utilizare

```js
import '@nikba/design-system/css';
import { setTheme, setGlassLevel } from '@nikba/design-system';

setTheme('frost');
setGlassLevel('soft');
```

```html
<button class="nds-button">Începe un proiect</button>
<button class="nds-button nds-button--secondary">Vezi proiectele</button>
```

## Licență

[MIT](LICENSE)
