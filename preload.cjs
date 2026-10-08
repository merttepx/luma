'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lumaDesktop', {
  getVersion: () => ipcRenderer.invoke('luma:version'),
  getUpdateSource: () => ipcRenderer.invoke('luma:update-source'),
  saveUpdateSource: source => ipcRenderer.invoke('luma:update-save', source),
  checkForUpdates: () => ipcRenderer.invoke('luma:update-check'),
  installUpdate: () => ipcRenderer.invoke('luma:update-install'),
  onUpdateStatus: callback => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('luma:update-state', listener);
    return () => ipcRenderer.removeListener('luma:update-state', listener);
  },
});
