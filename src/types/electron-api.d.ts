// src/types/electron-api.d.ts
export {}

declare global {
  interface Window {
    electronAPI: {
      getSystemInfo: () => Promise<any>
      pingHost: (host: string) => Promise<any>
      getConnectedDevices: () => Promise<any>
      runSpeedTest: () => Promise<{
        download: number;
        upload: number;
        ping: number;
        error?: string;
      }>;
      getFastToken: () => Promise<string>;
      fetchFastToken: () => Promise<string>;
    }
  }
}
