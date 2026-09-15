# Three.js Integration Boundary

Status: Alpha guidance for product-owned immersive media

## Decision

Three.js may provide a focused 3D scene in a product composition such as a Hero. The application owns the scene, assets, renderer, lifecycle, and dependency. Nikba Design System continues to own the surrounding typography, layout, controls, themes, and glass surfaces.

Three.js is not a dependency of the core package and a 3D scene is not a Nikba interface component.

## Required structure

- Keep the heading, supporting copy, and actions as semantic HTML outside the canvas.
- Treat a decorative canvas as hidden from assistive technology.
- Reserve the scene area before loading so layout does not shift.
- Show a static poster before initialization and whenever rendering is unavailable.
- Load the renderer after primary content and do not block the Hero copy.
- Pause rendering when the scene leaves the viewport or the page becomes hidden.
- Freeze the scene or retain the static poster when reduced motion is requested.
- Limit device pixel ratio and scene complexity on compact or constrained devices.
- Dispose geometry, materials, textures, observers, and event listeners when the composition is removed.

## Interaction

The scene remains decorative by default. Pointer response may add restrained depth, but it must not capture navigation, hide content, or require interaction to understand the page. Any meaningful control belongs in semantic HTML and uses Nikba components.

## Validation

- The Hero remains complete when JavaScript is disabled.
- The fallback remains visible when WebGL initialization fails.
- Primary content renders before the Three.js module starts.
- Reduced motion produces a stable frame.
- Rendering stops outside the viewport and in a hidden tab.
- The page retains responsive reflow and has no horizontal overflow.
