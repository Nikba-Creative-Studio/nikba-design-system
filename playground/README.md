# Nikba Design System Catalog

The catalog is the live development and review environment for the public package. It imports `src/index.js` directly, so source changes appear through Vite hot reload.

The catalog is split into focused pages for the overview, foundations, the component index, and each complete component. Shared appearance controls preserve the selected theme and glass level across navigation.

From the repository root:

```bash
npm run dev
```

To build and preview the static catalog:

```bash
npm run build:catalog
npm run preview
```

Catalog-specific layout belongs in `playground/styles.css`. Tokens, foundations, component styles, and public behavior must remain in `src`.
