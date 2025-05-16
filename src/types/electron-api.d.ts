// src/types/electron-api.d.ts
export {}

declare global {
  interface Window {
    electronAPI: {
      getSystemInfo: () => Promise<any>
      pingHost: (host: string) => Promise<any>
    }
  }
}
