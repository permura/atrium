/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string
        allowpopups?: string
        partition?: string
      },
      HTMLElement
    >
  }
}

interface AppConfig {
  shortcut: string
  startMinimized: boolean
  autoLaunch: boolean
}

interface ElectronAPI {
  getShortcut: () => Promise<string>
  setShortcut: (shortcut: string) => Promise<boolean>
  getConfig: () => Promise<AppConfig>
  setConfig: (key: string, value: unknown) => Promise<boolean>
  clearCache: () => Promise<void>
  resetTabs: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
