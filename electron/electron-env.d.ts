interface ElectronAPI {
  getSystemInfo: () => Promise<any>;
  pingHost: (host: string) => Promise<any>;
}

interface Window {
  electronAPI: ElectronAPI;
}
