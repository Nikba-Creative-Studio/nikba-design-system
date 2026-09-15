# Nikba Design System Specification

Status: Alpha foundation

Visual direction: Nikba Liquid Glass

Interaction tier: L2 — short, fluid, restrained

## 1. Design intent

Nikba interfaces should feel calm, precise, tactile, and mature. Technology is expressed through behavior and material response rather than decoration. Content remains the dominant layer; glass is used selectively for orientation, control, and focused feedback.

The system must not imitate a specific operating system. It should retain a recognizable Nikba voice across websites, application interfaces, and administrative products.

## 2. Themes

All themes share typography, geometry, component APIs, and interaction behavior.

| Theme | Character | Typical use |
| --- | --- | --- |
| Frost | Cool, bright, and precise | Default light experience |
| Mist | Warm, soft, and moderately layered | Editorial and relaxed interfaces |
| Graphite | Dark, smoky, and controlled | Dark product interfaces |

Themes are semantic mappings. Components consume `--nds-*` roles and never define theme-specific hex values.

## 3. Color roles

The public palette includes:

- Canvas and surface roles: background, surface, alternate surface, hover surface, glass, and strong glass
- Content roles: primary, secondary, tertiary, and inverse text
- Structure roles: border, hover border, shadows, and glass highlight
- Action roles: accent, accent hover, and focus
- Feedback roles: success, warning, danger, and info

Rules:

- Use variables for every component color.
- Keep the primary accent monochrome.
- Reserve feedback colors for meaningful status and validation.
- Meet WCAG AA contrast for essential text and controls.
- Do not place long-form text directly on translucent surfaces.
- Do not use the previous yellow brand accent.

## 4. Typography

Onest is the primary and only branded typeface. The fallback stack is system UI.

| Role | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- |
| Display | `clamp(3.5rem, 8vw, 7.5rem)` | 600 | 0.94 | -0.055em |
| Section heading | `clamp(2.25rem, 5vw, 4.75rem)` | 600 | 1.00 | -0.045em |
| Component heading | `clamp(1.25rem, 2vw, 1.75rem)` | 600 | 1.15 | -0.025em |
| Large body | `clamp(1.125rem, 1.8vw, 1.5rem)` | 400 | 1.50 | -0.012em |
| Body | `1rem` | 400 | 1.65 | -0.006em |
| Label | `0.75rem` | 600 | 1.20 | 0.08em |
| Code and metadata | `0.875rem` | 500 | 1.45 | 0.01em |

Keep readable text between approximately 58 and 68 characters per line. Avoid all caps except for short labels. Do not use text gradients, text shadows, serif display fonts, or decorative typefaces.

## 5. Geometry and spacing

Base spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 144px`.

- Page container: maximum `1280px`
- Narrow reading width: maximum `760px`
- Page gutter: `clamp(20px, 4vw, 64px)`
- Section spacing: `clamp(80px, 12vw, 160px)`
- Component gap: `clamp(16px, 2vw, 32px)`
- Card padding: `clamp(20px, 3vw, 40px)`

Prefer controlled asymmetry: generous space, one dominant element, and small supporting information groups. Use no more than three corner-radius roles in one view.

## 6. Depth and glass

| Level | Treatment | Use |
| --- | --- | --- |
| Flat | Page background without shadow | Editorial content and large regions |
| Surface | Solid background with border | Forms and informational cards |
| Glass | Translucency, 8–14px blur, inner highlight | Navigation, filters, and floating controls |
| Elevated | Elevated shadow | Menus, dialogs, and active layers |

Glass levels:

- Off: solid surface, no backdrop filter
- Soft: standard translucent surface with 8px blur
- Clear: lighter translucent surface with 14px blur

Glass must fall back to a solid surface when backdrop filtering is unavailable. Do not use blur above 14px on interactive surfaces. Do not apply glass to every card or section.

## 7. Component principles

Each component defines purpose, anatomy, API, variants, sizes, states, responsive behavior, accessibility, tokens, examples, and tests.

Native HTML semantics are the default. Visual disabled states never substitute for disabled behavior. Controls must have visible focus, adequate touch targets, and deterministic keyboard behavior.

The current Alpha public surface includes Button, Tag, Field, Glass, and scoped foundations. Component expansion follows [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

## 8. Motion and interaction

Motion is short, fluid, and tied to user action or content entry.

- Buttons may move up by 1px on hover.
- Cards may move up by 3px on hover.
- Functional elements never move more than 6px on hover.
- Pressed controls return toward the page plane.
- Avoid elastic, ornamental, or continuous motion.
- Use `requestAnimationFrame` for pointer-driven updates.
- Respect `prefers-reduced-motion` without hiding content.

The core interface must remain usable without JavaScript. JavaScript enhances state and interaction where native HTML cannot meet the contract.

Product-owned immersive media may use Three.js outside the component layer. It must preserve readable HTML content, remain decorative to assistive technology, pause outside the viewport, respect reduced motion, and provide a static fallback when WebGL is unavailable.

## 9. Responsive behavior

| Range | Grid | Primary change |
| --- | --- | --- |
| Desktop, 1100px and above | 12 columns | Full navigation and generous space |
| Tablet, 700–1099px | 8 columns | Reduced typography and simplified cards |
| Mobile, below 700px | 4 columns | Compact navigation and one-column content |

Touch targets are at least 44 by 44px. Primary actions are at least 48px high. Asymmetric card layouts collapse into a single column. Atmospheric elements remain static on mobile.

## 10. Accessibility baseline

- Target WCAG 2.1 AA as the minimum release standard.
- Preserve native roles, names, values, and relationships.
- Provide visible focus for every keyboard-operable element.
- Verify content at 200% zoom and responsive reflow at 400% where applicable.
- Support reduced motion, forced colors, and no-blur fallbacks.
- Do not encode status through color alone.
- Associate labels, helper text, and errors programmatically.
- Define focus placement and restoration for overlays.

Accessibility claims require browser, keyboard, and assistive-technology verification. Documentation must distinguish implemented behavior from verified behavior.

## 11. Prohibited treatments

- Yellow as the primary accent
- Gradient or shadow effects on text
- Glass across long reading surfaces
- Animated blur filters
- SVG displacement, canvas, or WebGL effects inside interface components
- 3D media without a static fallback or a defined performance budget
- Custom global cursors
- Emoji used as interface icons
- Readability sacrificed for visual effects

## 12. Documentation and API language

All documentation, source comments, public names, catalog content, test descriptions, releases, and migration guides use English. Localized product copy belongs only in explicit internationalization examples.
