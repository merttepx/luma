Luma Chat — Windows desktop app

Install with Luma-Chat-Setup-1.0.5.exe. The per-user NSIS installer adds
Start menu and desktop shortcuts.

What works in this desktop preview
- Loading screen followed by local sign-in or registration; a guest option is
  available. Accounts stay on this Windows profile and are not server-backed.
- Turkish and English interface language settings, saved between launches.
- Separate Settings, Profile, and Calls pages. Calls opens as its own page and
  no longer shows Settings/Profile navigation beside the call history.
- Appearance can be set to Light, Dark, or System. The System option follows
  Windows appearance and updates when the system theme changes.
- Messages support local ❤️ likes and 👍 😂 🎉 🔥 reactions; selections persist
  with the local chat history.
- Updates are checked automatically in the background; downloaded releases prompt before restart and installation.
- Recent and missed calls appear in the Calls page; new demo calls are saved locally.
- Recent searches are saved on this device and appear beneath the search box.
- Sample conversations, local message history, groups, friend controls, and a
  voice-call screen.

Chat, reactions, groups, and calling are still a front-end demonstration: they
are stored on this device and are not shared with other users. The call screen
does not send audio. Real accounts, shared messaging, and voice calls require
backend and calling services.

Updates
The configured release repository is https://github.com/merttepx/luma. The
included GitHub Actions workflow builds the Windows installer and publishes
the installer plus latest.yml on pushes to main. Installed apps check for newer
GitHub Releases at launch and every 20 minutes. An available update downloads
in the background and prompts before restarting. Each release must include
latest.yml. Windows may show an unknown-publisher prompt because this build
does not use a code-signing certificate.

Build locally on Windows with Node.js 24 and pnpm 11.25.0:
  pnpm install
  pnpm run build:win

Source files: main.cjs, preload.cjs, luma-chat.html, package.json,
pnpm-lock.yaml, pnpm-workspace.yaml, and .github/workflows/release.yml.
