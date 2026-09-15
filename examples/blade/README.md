# Laravel Blade integration

These files demonstrate a thin Blade layer over the published Nikba package. Copy the `resources` structure into a Laravel application, install `@nikba/design-system`, and include the application CSS and JavaScript through Laravel's Vite entry points.

```bash
npm install @nikba/design-system
```

The CSS entry imports the public stylesheet. The JavaScript entry initializes only behaviors present in the rendered document. Blade components own server-oriented concerns such as props, slots, and attribute forwarding; visual contracts remain public `nds-` classes.

The Button component maps a finite prop vocabulary to public variants and preserves caller attributes through Laravel's attribute bag. The Dialog component generates stable accessible-name references from its required ID and leaves actions in an explicit footer slot.

Do not translate every Nikba class into a Blade component. Use ordinary semantic HTML for simple compositions. Create a wrapper when it removes repeated server-side logic, enforces a valid variant set, or generates required accessibility relationships.
