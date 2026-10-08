Luma Chat — Windows desktop app

Install with Luma-Chat-Setup-1.0.4.exe. The per-user NSIS installer adds
Start menu and desktop shortcuts.

What works in this desktop preview
- Loading screen followed by local sign-in or registration; a guest option is
  available. Accounts stay on this Windows profile and are not server-backed.
- Turkish and English interface language settings, saved between launches.
- Separate Settings and Profile pages; the dark theme and notification
  preference are saved locally.
- Updates are checked automatically in the background; downloaded releases prompt before restart and installation.
- Recent and missed calls appear in the Calls page; new demo calls are saved locally.
- Recent searches are saved on this device and appear beneath the search box.
- Sample conversations, local message history, groups, friend controls, and a
  voice-call screen.

Chat, groups, and calling are still a front-end demonstration: they are not
connected between users and the call screen does not send audio. Real accounts,
shared messaging, and voice calls require backend and calling services.

Updates
The configured release repository is https://github.com/merttepx/luma. Push
this project to that repository. Create a Git tag matching package.json, such
as v1.0.1, and push the tag. The included GitHub Actions workflow builds the
Windows installer and publishes the installer plus latest.yml. Installed apps check for newer GitHub Releases at launch and every 20 minutes. If a check temporarily fails, background checks continue periodically and an available update prompts on screen. Each release must include latest.yml. The app downloads the update, then offers Restart and update. Windows may show an
unknown-publisher prompt because this build does not use a code-signing
certificate.

Build locally on Windows with Node.js 24 and pnpm 11.25.0:
  pnpm install
  pnpm run build:win

To publish from a tagged GitHub Actions release, use a tag matching the app
version, e.g. v1.0.4. The repository's Actions GITHUB_TOKEN is used for release
publishing; no personal access token is needed.

Source files: main.cjs, preload.cjs, luma-chat.html, package.json, and
.github/workflows/release.yml.
