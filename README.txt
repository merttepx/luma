Luma Chat — Windows desktop app

Install with Luma-Chat-Setup-1.0.6.exe. The per-user NSIS installer adds
Start menu and desktop shortcuts.

What works in this desktop preview
- Loading screen followed by local sign-in or registration; a guest option is
  available. Accounts stay on this Windows profile and are not server-backed.
- Turkish and English interface language settings, saved between launches.
- Separate Settings, Profile, and Calls pages. The Calls page is separate from
  Settings navigation.
- Appearance can be set to Light, Dark, or System and follows Windows changes
  when System is selected.
- Create group chats, text channels, or announcement channels. Set a name,
  topic, visibility, and category; created spaces persist on this device.
- Settings include per-space visibility, category, and notification preferences,
  plus local message, read-receipt, and availability privacy preferences.
- Profile controls include pronouns, custom status, availability, and profile
  color in addition to name, username, and bio.
- Messages support local ❤️ likes and 👍 😂 🎉 🔥 reactions; selections persist
  with the local chat history.
- Updates are checked automatically; a downloaded release prompts before
  restart and installation.
- Recent and missed calls appear in the Calls page; recent searches are saved.
- Sample conversations, local message history, friend controls, and a
  voice-call screen.

This remains a front-end demonstration: spaces, messages, reactions, and
preferences are stored on this device and are not shared with other users.
The call screen does not send audio. Real shared accounts, messaging, channel
permissions, and voice calls require backend services.

Updates
The configured release repository is https://github.com/merttepx/luma. The
GitHub Actions workflow builds the Windows installer, then publishes the
installer, blockmap, and latest.yml together in one release. Installed apps
check for newer GitHub Releases at launch and every 20 minutes. Windows may
show an unknown-publisher prompt because this build does not use a
code-signing certificate.

Build locally on Windows with Node.js 24 and pnpm 11.25.0:
  pnpm install
  pnpm run build:win

Source files: main.cjs, preload.cjs, luma-chat.html, package.json,
pnpm-lock.yaml, pnpm-workspace.yaml, and .github/workflows/release.yml.
