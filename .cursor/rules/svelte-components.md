# Svelte Component Guidelines

When generating code for Svelte components:
- Use Svelte's reactive declarations (e.g., `$:`, `let`) for state management.
- Bind events declaratively (e.g., `on:click={handleClick}`).
- Avoid React or Vue.js patterns like hooks or directives.
- Place components in `src/components`.

Applies to: src/components/**/*.svelte