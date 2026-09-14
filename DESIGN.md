# Nikba 2027 — Design System Beta

> O interfață calmă și precisă, în care tehnologia se simte prin comportament, nu prin decor excesiv.

**Status:** 🧪 Beta — bază pentru prototipuri vizuale, înaintea validării finale.

## 1. Visual Theme & Atmosphere

**Style:** Nikba Liquid Glass

**Keywords:** minimalist, neutru, luminos, tactil, fluid, precis, matur

**Tone:** calm, premium și funcțional; fără aspect SF ostentativ sau imitație literală a interfețelor Apple.

**Feel:** o suprafață digitală liniștită, peste care controalele plutesc discret și răspund natural.

**Interaction Tier:** L2 — interacțiune fluidă și discretă

**Dependencies:** CSS + JavaScript nativ; fără bibliotecă Liquid Glass sau WebGL.

### Variante pentru prototipuri

1. **Frost** — fundal alb rece, contrast clar, sticlă foarte discretă.
2. **Mist** — fundal gri cald, suprafețe mai moi, profunzime moderată.
3. **Graphite** — fundal închis, sticlă fumurie, contrast controlat.

Toate variantele folosesc aceeași tipografie, aceeași geometrie și aceleași componente.

### Decizie de implementare Beta

Efectul vizual va fi construit prin glassmorphism CSS nativ: transparență, `backdrop-filter`, bordură fină, highlight interior și umbră discretă. Nu se folosesc refracție SVG, canvas sau WebGL. O implementare Liquid Glass nativă poate fi evaluată ulterior ca progressive enhancement.

## 2. Color Palette & Roles

### Frost — varianta implicită

```css
:root,
[data-theme="frost"] {
  --bg: #f5f5f3;
  --surface: #ffffff;
  --surface-alt: #ececea;
  --surface-hover: #f9f9f8;
  --glass: rgba(255, 255, 255, 0.68);
  --glass-strong: rgba(255, 255, 255, 0.84);

  --border: #d9d9d5;
  --border-hover: #b8b8b2;

  --text: #171716;
  --text-secondary: #5f5f5a;
  --text-tertiary: #898983;
  --text-inverse: #ffffff;

  --accent: #20211f;
  --accent-hover: #3a3b38;
  --focus: #667085;

  --bg-rgb: 245, 245, 243;
  --surface-rgb: 255, 255, 255;
  --text-rgb: 23, 23, 22;
  --accent-rgb: 32, 33, 31;

  --success: #237a57;
  --error: #b43b3b;
  --warning: #956b20;

  --shadow-subtle: 0 1px 2px rgba(23, 23, 22, 0.05), 0 8px 30px rgba(23, 23, 22, 0.04);
  --shadow-elevated: 0 16px 50px rgba(23, 23, 22, 0.12);
  --glass-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}
```

### Mist — test alternativ

```css
[data-theme="mist"] {
  --bg: #e9e9e5;
  --surface: #f4f4f1;
  --surface-alt: #deded9;
  --surface-hover: #fafaf7;
  --glass: rgba(246, 246, 242, 0.62);
  --glass-strong: rgba(246, 246, 242, 0.8);

  --border: #cbcbc5;
  --border-hover: #aaa9a2;

  --text: #1c1d1b;
  --text-secondary: #5c5d58;
  --text-tertiary: #7f8079;
  --text-inverse: #ffffff;

  --accent: #292b28;
  --accent-hover: #444640;
  --focus: #69716b;

  --bg-rgb: 233, 233, 229;
  --surface-rgb: 244, 244, 241;
  --text-rgb: 28, 29, 27;
  --accent-rgb: 41, 43, 40;

  --success: #237a57;
  --error: #a83e3e;
  --warning: #8b6728;

  --shadow-subtle: 0 1px 2px rgba(28, 29, 27, 0.06), 0 10px 32px rgba(28, 29, 27, 0.06);
  --shadow-elevated: 0 18px 54px rgba(28, 29, 27, 0.14);
  --glass-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.62);
}
```

### Graphite — test alternativ

```css
[data-theme="graphite"] {
  color-scheme: dark;
  --bg: #111210;
  --surface: #1a1b19;
  --surface-alt: #222320;
  --surface-hover: #292a27;
  --glass: rgba(31, 32, 29, 0.62);
  --glass-strong: rgba(31, 32, 29, 0.82);

  --border: #343632;
  --border-hover: #555851;

  --text: #f2f2ee;
  --text-secondary: #b4b5ae;
  --text-tertiary: #85877f;
  --text-inverse: #161714;

  --accent: #eeeee9;
  --accent-hover: #d4d5ce;
  --focus: #a6ada7;

  --bg-rgb: 17, 18, 16;
  --surface-rgb: 26, 27, 25;
  --text-rgb: 242, 242, 238;
  --accent-rgb: 238, 238, 233;

  --success: #65b68e;
  --error: #e27a7a;
  --warning: #d3ac63;

  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.18), 0 10px 34px rgba(0, 0, 0, 0.16);
  --shadow-elevated: 0 20px 60px rgba(0, 0, 0, 0.32);
  --glass-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

**Color Rules:**

- Toate culorile din interfață folosesc variabile CSS.
- Nu se folosește galbenul din identitatea anterioară.
- Accentul principal rămâne monocrom; culorile semantice apar doar în feedback.
- Sticla se aplică pe suprafețe mici și medii, niciodată peste zone lungi de lectură.
- Blur-ul este limitat la navigație, meniuri și câteva controale vizibile simultan.
- Contrastul textului trebuie să respecte WCAG AA.

## 3. Typography Rules

**Font Stack:**

```css
@import url('https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap');

:root {
  --font-sans: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

| Rol | Font | Dimensiune | Greutate | Line height | Letter spacing |
|---|---|---:|---:|---:|---:|
| Hero H1 | Onest | clamp(3.5rem, 8vw, 7.5rem) | 600 | 0.94 | -0.055em |
| Section H2 | Onest | clamp(2.25rem, 5vw, 4.75rem) | 600 | 1.00 | -0.045em |
| H3 | Onest | clamp(1.25rem, 2vw, 1.75rem) | 600 | 1.15 | -0.025em |
| Body large | Onest | clamp(1.125rem, 1.8vw, 1.5rem) | 400 | 1.50 | -0.012em |
| Body | Onest | 1rem | 400 | 1.65 | -0.006em |
| Label | Onest | 0.75rem | 600 | 1.20 | 0.08em |
| Code / date | Onest | 0.875rem | 500 | 1.45 | 0.01em |

**Typography Rules:**

- Onest este unicul font folosit în site și în panoul administrativ personalizat.
- Titlurile folosesc cel mult greutatea 600; greutatea 700 este rezervată cifrelor scurte.
- Lățimea optimă pentru text este de 58–68 caractere.
- Se evită scrierea integrală cu majuscule, cu excepția etichetelor scurte.
- **Nu se folosesc:** Inter, SF Pro, Arial, fonturi serif sau fonturi decorative.

**Text Decoration:**

- Hero H1: fără gradient și fără umbră.
- Section H2 și H3: fără gradient și fără umbră.
- Linkurile primesc subliniere animată la hover.
- Contrastul, dimensiunea și ritmul creează ierarhia tipografică.

## 4. Component Stylings

### Buttons

```css
.button {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.125rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--accent);
  color: var(--text-inverse);
  font: 600 0.9375rem/1 var(--font-sans);
  text-decoration: none;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease,
    border-color 180ms ease, opacity 180ms ease;
}

.button:hover { background: var(--accent-hover); transform: translateY(-1px); }
.button:active { transform: translateY(0) scale(0.98); }
.button:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; }
.button:disabled,
.button[aria-disabled="true"] { opacity: 0.42; cursor: not-allowed; transform: none; }

.button--secondary {
  border-color: var(--border);
  background: var(--glass);
  color: var(--text);
  box-shadow: var(--glass-highlight);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
}

.button--secondary:hover { background: var(--glass-strong); border-color: var(--border-hover); }
```

### Cards

```css
.card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-subtle);
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 260ms ease, box-shadow 260ms ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-elevated);
}

.card:focus-within { outline: 3px solid var(--focus); outline-offset: 3px; }
.card:active { transform: translateY(-1px); }
.card[aria-disabled="true"] { opacity: 0.48; pointer-events: none; }

.card--glass {
  background: var(--glass);
  box-shadow: var(--glass-highlight), var(--shadow-subtle);
  backdrop-filter: blur(14px) saturate(125%);
  -webkit-backdrop-filter: blur(14px) saturate(125%);
}
```

### Navigation

```css
.nav {
  position: fixed;
  inset: 16px 0 auto;
  z-index: 100;
  width: min(calc(100% - 32px), 1180px);
  min-height: 58px;
  margin-inline: auto;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  transition: background-color 240ms ease, border-color 240ms ease,
    box-shadow 240ms ease;
}

.nav.is-scrolled {
  border-color: var(--border);
  background: var(--glass-strong);
  box-shadow: var(--glass-highlight), var(--shadow-subtle);
  backdrop-filter: blur(14px) saturate(125%);
  -webkit-backdrop-filter: blur(14px) saturate(125%);
}

.nav a { color: var(--text-secondary); text-decoration: none; }
.nav a:hover,
.nav a[aria-current="page"] { color: var(--text); }
.nav a:active { opacity: 0.68; }
.nav a:focus-visible { outline: 3px solid var(--focus); outline-offset: 4px; border-radius: 6px; }
.nav a[aria-disabled="true"] { opacity: 0.42; pointer-events: none; }
```

### Links

```css
.text-link {
  color: var(--text);
  text-decoration-color: var(--border-hover);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.3em;
  transition: color 180ms ease, text-decoration-color 180ms ease;
}

.text-link:hover { color: var(--text-secondary); text-decoration-color: var(--text); }
.text-link:active { opacity: 0.65; }
.text-link:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; border-radius: 4px; }
.text-link[aria-disabled="true"] { opacity: 0.42; pointer-events: none; }
```

### Tags / Badges

```css
.tag {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--glass);
  color: var(--text-secondary);
  font: 600 0.75rem/1 var(--font-sans);
  letter-spacing: 0.04em;
  transition: background-color 180ms ease, border-color 180ms ease;
}

.tag:hover { background: var(--glass-strong); border-color: var(--border-hover); }
.tag:active { opacity: 0.72; }
.tag:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; }
.tag[aria-disabled="true"] { opacity: 0.42; pointer-events: none; }
```

### Fields

```css
.field {
  width: 100%;
  min-height: 52px;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  color: var(--text);
  font: 400 1rem/1.4 var(--font-sans);
  transition: border-color 180ms ease, box-shadow 180ms ease,
    background-color 180ms ease;
}

.field:hover { border-color: var(--border-hover); }
.field:focus { border-color: var(--focus); outline: none; box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.12); }
.field:disabled { opacity: 0.48; cursor: not-allowed; }
.field[aria-invalid="true"] { border-color: var(--error); }
```

## 5. Layout Principles

**Container:**

- Max width: `1280px`
- Page padding: `clamp(20px, 4vw, 64px)`
- Narrow text container: `760px`

**Spacing Scale:** `4, 8, 12, 16, 24, 32, 48, 64, 96, 144px`

- Section padding: `clamp(80px, 12vw, 160px)`
- Component gap: `clamp(16px, 2vw, 32px)`
- Card padding: `clamp(20px, 3vw, 40px)`

**Grid:**

```css
.container {
  width: min(100% - clamp(40px, 8vw, 128px), 1280px);
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 32px);
}

.section { padding-block: clamp(80px, 12vw, 160px); }
.prose { width: min(100%, 760px); }
```

Se preferă compozițiile asimetrice controlate: mult spațiu liber, un element dominant și grupuri mici de informații.

## 6. Depth & Elevation

| Nivel | Tratament | Utilizare |
|---|---|---|
| Flat | fără umbră, fundalul paginii | conținut editorial și secțiuni ample |
| Surface | fundal solid + border | carduri informative și formulare |
| Glass | blur 12–14px + highlight interior | navigație, filtre și controale flotante |
| Elevated | `var(--shadow-elevated)` | meniuri, dialoguri și carduri active |

Sticla nu acoperă fundaluri aglomerate. Pentru browsere fără `backdrop-filter`, suprafața devine aproape opacă prin `var(--glass-strong)`.

## 7. Animation & Interaction

**Motion Philosophy:** mișcare scurtă, fluidă și legată direct de acțiunea utilizatorului.

**Tier:** L2

### Dependencies

Nu sunt necesare biblioteci externe. Se folosesc CSS, `IntersectionObserver` și evenimente limitate prin `requestAnimationFrame`.

### Entrance and text animations

```css
.hero-title {
  animation: title-enter 850ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes title-enter {
  from { opacity: 0; transform: translateY(24px); clip-path: inset(0 0 28% 0); }
  to { opacity: 1; transform: translateY(0); clip-path: inset(0); }
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 650ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.is-visible { opacity: 1; transform: translateY(0); }

.eyebrow.reveal {
  transform: translateY(10px);
  letter-spacing: 0.14em;
}

.eyebrow.reveal.is-visible { letter-spacing: 0.08em; }
```

### Scroll behavior and navigation state

```js
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

const navigation = document.querySelector('.nav');
const updateNavigation = () => {
  navigation?.classList.toggle('is-scrolled', window.scrollY > 20);
};

window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();
```

### Element interaction

Butoanele folosesc o deplasare de `-1px`, cardurile de `-3px`, iar apăsarea revine spre planul paginii. Niciun element funcțional nu se mișcă mai mult de `6px` la hover.

### Interactive component — glass spotlight

```css
.spotlight::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    360px circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(var(--surface-rgb), 0.72),
    transparent 70%
  );
  transition: opacity 220ms ease;
}

.spotlight:hover::before { opacity: 1; }
```

```js
if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.spotlight').forEach((card) => {
    let frame;
    card.addEventListener('pointermove', (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      });
    });
  });
}
```

### Ambient background

Fundalul folosește două forme statice foarte difuze. Pe desktop, una se deplasează cu maximum `20px` în funcție de scroll; pe mobil rămâne statică. Nu se aplică `filter: blur()` pe elemente aflate în mișcare.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }

  .reveal,
  .hero-title { opacity: 1; transform: none; clip-path: none; }
}
```

## 8. Do's and Don'ts

### Do

- Folosește Onest pentru fiecare nivel de text.
- Păstrează suprafețe ample fără efect de sticlă.
- Folosește sticla pentru orientare, control și feedback.
- Păstrează contraste clare și spațiu generos.
- Leagă fiecare animație de apariția sau acțiunea unui element.
- Oferă fallback solid pentru transparență și blur.
- Păstrează efectul principal complet funcțional fără JavaScript.
- Folosește iconuri liniare simple, cu aceeași grosime optică.
- Testează fiecare componentă în Frost, Mist și Graphite.

### Don't

- ❌ Nu folosi galbenul vechi ca accent.
- ❌ Nu folosi gradient pe text.
- ❌ Nu adăuga umbre textului.
- ❌ Nu aplica Liquid Glass fiecărui card sau fiecărei secțiuni.
- ❌ Nu folosi blur mai mare de `14px` pe suprafețe interactive.
- ❌ Nu plasa text lung direct peste fundaluri translucide.
- ❌ Nu folosi animații elastice sau ostentative.
- ❌ Nu modifica cursorul global.
- ❌ Nu introduce emoji ca iconuri de interfață.
- ❌ Nu combina mai mult de trei raze de colț într-un singur ecran.
- ❌ Nu folosi elemente 3D fără rol în conținut.
- ❌ Nu folosi SVG displacement, canvas sau WebGL pentru suprafețele de sticlă.
- ❌ Nu sacrifica lizibilitatea pentru efectul de sticlă.

## 9. Responsive Behavior

| Nume | Lățime | Schimbări principale |
|---|---:|---|
| Desktop | peste 1100px | grid cu 12 coloane, navigație completă, spațiu amplu |
| Tabletă | 700–1099px | grid cu 8 coloane, carduri simplificate, tipografie redusă |
| Mobil | sub 700px | grid cu 4 coloane, navigație compactă, o coloană principală |

**Touch Targets:** minimum `44 × 44px`; CTA-urile principale au minimum `48px` înălțime.

**Collapsing Strategy:** cardurile asimetrice devin o listă cu o singură coloană; navigația devine un control compact Liquid Glass; elementele atmosferice rămân statice.

```css
@media (max-width: 1099px) {
  .grid { grid-template-columns: repeat(8, minmax(0, 1fr)); }
}

@media (max-width: 699px) {
  .container { width: min(100% - 40px, 1280px); }
  .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .section { padding-block: 80px; }
  .nav { inset-block-start: 10px; width: calc(100% - 20px); }
  .card { border-radius: 22px; }
  .card:hover { transform: none; }
}

@supports not (backdrop-filter: blur(1px)) {
  .card--glass,
  .button--secondary,
  .nav.is-scrolled { background: var(--surface); }
}
```
