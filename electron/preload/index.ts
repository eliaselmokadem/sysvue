// electron/preload/index.ts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('getSystemInfo'),
  pingHost: (host) => ipcRenderer.invoke('pingHost', host),
  getConnectedDevices: () => ipcRenderer.invoke('getConnectedDevices'),  // Al toegevoegd
});
