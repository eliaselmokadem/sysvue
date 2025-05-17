// electron/preload/index.ts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  pingHost: (host) => ipcRenderer.invoke('ping-host', host),
  getConnectedDevices: () => ipcRenderer.invoke('getConnectedDevices'),  // Al toegevoegd
});
