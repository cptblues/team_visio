# Security Best Practices

For security:
- Never hardcode sensitive data like API keys, Agora App IDs, or Firebase credentials.
- Use environment variables (e.g., `import.meta.env.VITE_FIREBASE_API_KEY`).
- Delegate sensitive operations to Firebase Cloud Functions when possible.

Applies to: src/**/*.*