'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const { NsisUpdater } = require('electron-updater');

let updater = null;
let updaterSourceKey = '';
let updateConfigFile = '';
const isDevelopment = !app.isPackaged;
const defaultUpdateSource = { provider: 'github', owner: 'merttepx', repo: 'luma' };

function sendUpdateState(state) {
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) window.webContents.send('luma:update-state', state);
  }
}

function readUpdateSource() {
  try {
    const value = JSON.parse(fs.readFileSync(updateConfigFile, 'utf8'));
    if (value && value.provider === 'github' && /^[A-Za-z0-9_.-]{1,100}$/.test(value.owner) && /^[A-Za-z0-9_.-]{1,100}$/.test(value.repo)) return value;
  } catch { /* First launch: use this app's configured release repository. */ }
  return defaultUpdateSource;
}

function createUpdater(source) {
  const nextUpdater = new NsisUpdater({ provider: 'github', owner: source.owner, repo: source.repo });
  nextUpdater.autoDownload = true;
  nextUpdater.autoInstallOnAppQuit = false;
  nextUpdater.autoInstallEvent = 'manual';
  nextUpdater.on('checking-for-update', () => sendUpdateState({ state: 'checking' }));
  nextUpdater.on('update-available', info => sendUpdateState({ state: 'available', version: info.version }));
  nextUpdater.on('update-not-available', () => sendUpdateState({ state: 'current' }));
  nextUpdater.on('download-progress', progress => sendUpdateState({ state: 'progress', percent: progress.percent }));
  nextUpdater.on('update-downloaded', info => sendUpdateState({ state: 'ready', version: info.version }));
  nextUpdater.on('error', error => {
sendUpdateState({ state: 'error', message: error.message });
  });
  return nextUpdater;
}

async function checkForUpdates({ manual = false } = {}) {
if (!app.isPackaged) return { ok: false, message: 'Automatic updates are available in the installed app.' };
  const source = readUpdateSource();
  if (!source) {
    sendUpdateState({ state: 'unconfigured' });
    return { ok: false, message: 'Add the public GitHub owner/repository in Settings first.' };
  }
  try {
    const sourceKey = `${source.owner}/${source.repo}`;
    if (!updater || updaterSourceKey !== sourceKey) {
      updater = createUpdater(source);
      updaterSourceKey = sourceKey;
    }
    await updater.checkForUpdates();
    return { ok: true };
  } catch (error) {
    sendUpdateState({ state: 'error', message: error.message });
    return { ok: false, message: error.message };
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1420,
    height: 900,
    minWidth: 1000,
    minHeight: 680,
    backgroundColor: '#f7f8fa',
    title: 'Luma Chat',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  window.loadFile(path.join(__dirname, 'luma-chat.html')).catch(error => {
    dialog.showErrorBox('Luma Chat could not start', error.message);
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    if (url !== window.webContents.getURL()) event.preventDefault();
  });
  if (isDevelopment) window.webContents.openDevTools({ mode: 'detach' });
  return window;
}

ipcMain.handle('luma:version', () => app.getVersion());
ipcMain.handle('luma:update-source', () => readUpdateSource());
ipcMain.handle('luma:update-save', (_event, candidate) => {
  const owner = String(candidate?.owner || '').trim();
  const repo = String(candidate?.repo || '').trim();
  if (!/^[A-Za-z0-9_.-]{1,100}$/.test(owner) || !/^[A-Za-z0-9_.-]{1,100}$/.test(repo)) {
    return { ok: false, message: 'Enter a public GitHub repository in owner/repository format.' };
  }
  fs.mkdirSync(path.dirname(updateConfigFile), { recursive: true });
  fs.writeFileSync(updateConfigFile, JSON.stringify({ provider: 'github', owner, repo }, null, 2), 'utf8');
  updater = null;
  updaterSourceKey = '';
  return { ok: true };
});
ipcMain.handle('luma:update-check', () => checkForUpdates({ manual: true }));
ipcMain.handle('luma:update-install', () => {
  if (!updater) return { ok: false, message: 'No downloaded update is available.' };
  updater.quitAndInstall(false, true);
  return { ok: true };
});

app.whenReady().then(() => {
  updateConfigFile = path.join(app.getPath('userData'), 'update-source.json');
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'Luma', submenu: [
      { label: 'About Luma Chat', click: () => dialog.showMessageBox({ type: 'info', title: 'About Luma Chat', message: 'Luma Chat', detail: `Desktop chat prototype · Version ${app.getVersion()}` }) },
      { type: 'separator' }, { role: 'quit' },
    ] },
    { label: 'Edit', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'togglefullscreen' }] },
  ]));
  createWindow();
  if (app.isPackaged) {
    setTimeout(() => checkForUpdates(), 4000);
    setInterval(() => checkForUpdates(), 20 * 60 * 1000);
  }
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
}).catch(error => dialog.showErrorBox('Luma Chat failed to start', error.stack || error.message));

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
