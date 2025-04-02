# Firebase Integration Rules

When working with Firebase:
- Use the official Firebase Web SDK for Firestore and Authentication.
- Structure data in collections like `users`, `sessions`, and `rooms`.
- Use `onSnapshot` for real-time updates from Firestore.
- Avoid hardcoding Firebase configuration; reference it from environment variables.

Applies to: src/lib/**/*.{js,ts}