// electron/preload/index.ts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  pingHost: (host: string) => ipcRenderer.invoke('ping-host', host)
});
