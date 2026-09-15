# Plain HTML and JavaScript consumer

This framework-free example imports only the published package exports:

```js
import '@nikba/design-system/css';
import { initDialogs, setTheme } from '@nikba/design-system';
```

Install the package, load `main.js` through a standards-based module bundler, and keep component markup in ordinary HTML. The controls remain semantic before JavaScript runs; initialization adds behavior only where the platform needs coordination.

The repository's `test:consumer` command packs the current library, installs that immutable archive into a temporary copy of this example, and runs a production build. It prevents examples from passing through unpublished source imports.
