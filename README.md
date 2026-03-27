# Forge App — Reusable Electron Wrapper

One codebase → multiple branded desktop apps, each as its own `.dmg` / `.exe`.

---

## Project Structure

```
forge-app/
├── apps.config.js      ← ✏️  THE ONLY FILE YOU EDIT to add/change apps
├── main.js             ← Electron main process (shared, never touch)
├── preload.js          ← IPC bridge (shared, never touch)
├── build.js            ← Build script (shared, never touch)
├── package.json
├── src/
│   └── index.html      ← Reusable window UI (shared, never touch)
└── assets/
    ├── forgeq/
    │   ├── icon.icns   ← macOS icon
    │   ├── icon.ico    ← Windows icon
    │   └── icon.png    ← Linux icon (512×512)
    └── forgestudio/
        ├── icon.icns
        ├── icon.ico
        └── icon.png
```

---

## Quick Start

```bash
npm install

# Run ForgeQ in dev
npm run start:forgeq

# Run Forge Studio in dev
npm run start:forgestudio
```

---

## Build Installers

```bash
# ── All platforms ──────────────────────────────
npm run build:forgeq          # → dist/forgeq/ForgeQ-mac.dmg + .exe + .AppImage
npm run build:forgestudio     # → dist/forgestudio/ForgeStudio-mac.dmg + .exe + .AppImage

# ── Single platform ────────────────────────────
npm run build:forgeq:mac
npm run build:forgeq:win
npm run build:forgeq:linux

npm run build:forgestudio:mac
npm run build:forgestudio:win
npm run build:forgestudio:linux
```

Output lands in `dist/<appKey>/`.

---

## Add a New App

Open `apps.config.js` and add an entry:

```js
myapp: {
  name:        'My App',
  url:         'https://myapp.example.com',
  color:       '#00C896',
  appId:       'com.example.myapp',
  description: 'My App description',
  icon: {
    mac:   'assets/myapp/icon.icns',
    win:   'assets/myapp/icon.ico',
    linux: 'assets/myapp/icon.png',
  },
},
```

Then add icons to `assets/myapp/` and run:

```bash
APP_KEY=myapp electron .           # dev
node build.js --app=myapp          # build
```

No other files need to change.

---

## Icons

Generate all three formats from a single 1024×1024 PNG:

```bash
npx electron-icon-maker --input=myicon.png --output=./assets/myapp
```

Or use https://icon.kitchen.

---

## Features

- 🔒 `contextIsolation` + `contextBridge` — secure by default
- 🔄 Back / Forward / Reload nav controls
- 💥 Error screen with Retry button if the URL fails to load
- 🌐 External links open in system browser
- 🎨 Per-app accent color + animated badge dot
- 🍎 macOS native traffic-light buttons
- 📦 macOS `.dmg`, Windows `.exe` (NSIS), Linux `.AppImage` + `.deb`
