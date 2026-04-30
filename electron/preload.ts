import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getShortcut: () => ipcRenderer.invoke('get-shortcut'),
  setShortcut: (shortcut: string) => ipcRenderer.invoke('set-shortcut', shortcut),
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (key: string, value: unknown) => ipcRenderer.invoke('set-config', key, value),
  clearCache: () => ipcRenderer.invoke('clear-cache'),
  resetTabs: () => ipcRenderer.invoke('reset-tabs'),
})
