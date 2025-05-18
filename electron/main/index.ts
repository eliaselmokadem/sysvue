const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');
const ping = require('ping');
const find = require('local-devices');
const FastSpeedtest = require("fast-speedtest-api");
const { exec } = require('child_process');

let win;
let cachedToken = '';

// ✅ Correcte dynamic import voor node-fetch (ESM fix)
const fetchNode = (...args: Parameters<typeof import("node-fetch")["default"]>) =>
  import("node-fetch").then(mod => mod.default(...args));

// ✅ Inline token fetch functie (geen aparte import nodig)
async function fetchFastToken(): Promise<string> {
  const res = await fetch("https://api.fast.com/netflix/speedtest");
  const json = await res.json();
  if (!json.token) throw new Error("Geen token gevonden via Fast.com");
  return json.token;
}

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadURL('http://localhost:5173'); // of: win.loadFile('index.html')
  win.webContents.openDevTools(); // tijdelijk aan voor debug
});

// ✅ IPC: Systeeminformatie ophalen
ipcMain.handle('get-system-info', async () => {
  const net = await si.networkInterfaces();
  const mem = await si.mem();
  const cpu = await si.currentLoad();
  return { net, mem, cpu };
});

// ✅ IPC: Ping uitvoeren
ipcMain.handle('ping-host', async (_, host) => {
  const res = await ping.promise.probe(host);
  return res;
});

// ✅ IPC: Verbonden apparaten ophalen
ipcMain.handle('getConnectedDevices', async () => {
  const devices = await find();
  return devices.map(dev => ({
    ip: dev.ip,
    mac: dev.mac,
    hostname: dev.name || 'Onbekend',
    status: 'Online',
  }));
});

// ✅ IPC: Internet speedtest uitvoeren

ipcMain.handle("run-speedtest", async () => {
  return new Promise((resolve) => {
    const pathToSpeedtest = path.resolve(__dirname, "../../node_modules/speedtest-net/bin/speedtest.js");
    const cmd = `"${process.execPath}" "${pathToSpeedtest}" --json`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("⚠️ Speedtest CLI fout:", stderr || error.message);
        return resolve({ error: "Speedtest mislukt: " + (stderr || error.message) });
      }

      try {
        const result = JSON.parse(stdout);
        resolve({
          download: (result.download.bandwidth / 125000).toFixed(2), // B/s → Mbps
          upload: (result.upload.bandwidth / 125000).toFixed(2),
          ping: result.ping.latency.toFixed(0),
        });
      } catch (err) {
        console.error("⚠️ JSON parse fout:", err);
        resolve({ error: "Speedtest JSON parsing fout" });
      }
    });
  });
});
