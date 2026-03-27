const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const appsConfig = require('./apps.config');

// ── Resolve which app to run ───────────────────────────────────
// Build sets productName = cfg.name, so app.name resolves to it.
// In dev: APP_KEY=forgeq npm start
const appKey = process.env.APP_KEY
  || app.name?.toLowerCase().replace(/\s+/g, '');
const cfg = appsConfig[appKey];

if (!cfg) {
  const available = Object.keys(appsConfig).join(', ');
  console.error(`[forge-app] Unknown APP_KEY="${appKey}". Available: ${available}`);
  process.exit(1);
}

app.setName(cfg.name);

// ── Window ─────────────────────────────────────────────────────
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    title: cfg.name,
    // Use native frame — no custom titlebar HTML needed at all
    // Users get a standard OS window with your app URL inside
    backgroundColor: '#0a0a0b',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      // No preload needed — we're loading an external URL directly
      // The page is your React app, just like in a browser
    },
    show: false,
    icon: path.join(
      __dirname,
      cfg.icon[
        process.platform === 'darwin' ? 'mac'
        : process.platform === 'win32' ? 'win'
        : 'linux'
      ]
    ),
  });

  // ✅ Load your production URL directly — no HTML wrapper, no webview
  win.loadURL(cfg.url);

  win.once('ready-to-show', () => win.show());
  buildMenu();
}

// ── Native menu ────────────────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: cfg.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),
    {
      label: 'View',
      submenu: [
        { label: 'Reload',        accelerator: 'CmdOrCtrl+R',       click: () => win?.reload() },
        { label: 'Hard Reload',   accelerator: 'CmdOrCtrl+Shift+R', click: () => win?.webContents.reloadIgnoringCache() },
        { type: 'separator' },
        { label: 'Toggle DevTools', accelerator: 'CmdOrCtrl+Alt+I', role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' }, { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }]
          : [{ role: 'close' }]
        ),
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── Open external links in browser, not new Electron windows ──
app.on('web-contents-created', (_e, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

// ── App lifecycle ──────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
