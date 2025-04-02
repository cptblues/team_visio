# Agora.io Video and Audio Rules

When implementing real-time communication:
- Use the Agora.io Web SDK.
- Initialize the client with `AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })`.
- Automatically join channels and publish audio/video streams on room entry.
- Handle errors with try/catch blocks.

Applies to: src/lib/agora/*.js