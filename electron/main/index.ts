// electron/main/index.ts
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');
const ping = require('ping');
const find = require('local-devices');

let win;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL('http://localhost:5173'); // of: win.loadFile('index.html')
  win.webContents.openDevTools(); // voeg dit tijdelijk toe

});

// IPC-handlers
ipcMain.handle('get-system-info', async () => {
  const net = await si.networkInterfaces();
  const mem = await si.mem();
  const cpu = await si.currentLoad();
  return { net, mem, cpu };
});

ipcMain.handle('ping-host', async (_, host) => {
  const res = await ping.promise.probe(host);
  return res;
});

ipcMain.handle('getConnectedDevices', async () => {
  const devices = await find();  // Voert echte netwerk scan uit
  // Voeg eventueel status toe
  const formattedDevices = devices.map(dev => ({
    ip: dev.ip,
    mac: dev.mac,
    hostname: dev.name || 'Unknown',
    status: 'Online' // Default waarde; eventueel meer gedetailleerd checken
  }));
  return formattedDevices;
});