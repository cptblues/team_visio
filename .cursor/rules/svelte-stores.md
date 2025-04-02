Reference: @file .cursor/rules/firebase-integration.md
# Svelte Stores Management

For state management:
- Use Svelte stores (`writable`, `readable`) for global state (e.g., user data, room status).
- Update stores reactively when Firebase or Agora.io data changes.
- Import stores into components with `import { storeName } from '$lib/stores'`.

Applies to: src/**/*.{svelte,js,ts}