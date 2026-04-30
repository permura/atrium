import { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, shell, ipcMain } from 'electron'
import { join } from 'path'
import { platform } from 'os'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

const isMac = platform() === 'darwin'

let win: BrowserWindow | null = null
let tray: Tray | null = null

interface AppConfig {
  shortcut: string
  startMinimized: boolean
  autoLaunch: boolean
}

const defaultConfig: AppConfig = {
  shortcut: isMac ? 'Cmd+Shift+Space' : 'Ctrl+Shift+Space',
  startMinimized: false,
  autoLaunch: false,
}

const configPath = join(app.getPath('userData'), 'settings.json')

function loadConfig(): AppConfig {
  try {
    if (existsSync(configPath)) {
      return { ...defaultConfig, ...JSON.parse(readFileSync(configPath, 'utf-8')) }
    }
  } catch { /* ignore */ }
  return { ...defaultConfig }
}

let config = loadConfig()

function saveConfig() {
  const dir = app.getPath('userData')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(configPath, JSON.stringify(config), 'utf-8')
}

function registerShortcut(shortcut: string) {
  globalShortcut.unregisterAll()
  const ok = globalShortcut.register(shortcut, toggleWindow)
  if (!ok) console.warn(`Failed to register shortcut: ${shortcut}`)
  return ok
}

const chromeUA = isMac
  ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 500,
    title: 'Atrium',
    autoHideMenuBar: true,
    show: !config.startMinimized,
    webPreferences: {
      webviewTag: true,
      preload: join(__dirname, 'preload.js'),
    },
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }

  win.on('close', (e) => {
    if (tray) {
      e.preventDefault()
      win?.hide()
    }
  })

  win.on('closed', () => {
    win = null
  })
}

function createTray() {
  const canvas = Buffer.alloc(16 * 16 * 4)
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const i = (y * 16 + x) * 4
      const inSquare = x >= 2 && x <= 13 && y >= 2 && y <= 13
      const inInner = x >= 5 && x <= 10 && y >= 5 && y <= 10
      if (inInner) {
        canvas[i] = 137; canvas[i + 1] = 180; canvas[i + 2] = 250; canvas[i + 3] = 255
      } else if (inSquare) {
        canvas[i] = 205; canvas[i + 1] = 214; canvas[i + 2] = 244; canvas[i + 3] = 180
      } else {
        canvas[i + 3] = 0
      }
    }
  }

  const icon = nativeImage.createFromBuffer(canvas, { width: 16, height: 16 })
  tray = new Tray(icon)
  tray.setToolTip('Atrium')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示/隐藏',
      click: toggleWindow,
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        tray = null
        globalShortcut.unregisterAll()
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)
  tray.on('click', toggleWindow)
}

function toggleWindow() {
  if (!win) {
    createWindow()
    return
  }
  if (win.isVisible() && win.isFocused()) {
    win.hide()
  } else {
    win.show()
    win.focus()
  }
}

app.on('web-contents-created', (_event, contents) => {
  if (contents.getType() === 'webview') {
    contents.setUserAgent(chromeUA)
    contents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })
  }
})

app.whenReady().then(() => {
  // IPC handlers
  ipcMain.handle('get-shortcut', () => config.shortcut)
  ipcMain.handle('set-shortcut', (_event, shortcut: string) => {
    const ok = registerShortcut(shortcut)
    if (ok) {
      config.shortcut = shortcut
      saveConfig()
    }
    return ok
  })

  ipcMain.handle('get-config', () => ({ ...config }))
  ipcMain.handle('set-config', (_event, key: string, value: unknown) => {
    ;(config as Record<string, unknown>)[key] = value
    saveConfig()
    // Apply autoLaunch setting immediately
    if (key === 'autoLaunch') {
      app.setLoginItemSettings({ openAtLogin: !!value })
    }
    return true
  })

  ipcMain.handle('clear-cache', async () => {
    if (win) {
      await win.webContents.session.clearStorageData()
      for (const wc of win.webContents.getAllWebViews()) {
        await wc.session.clearStorageData()
      }
    }
  })

  ipcMain.handle('reset-tabs', () => {
    if (win) {
      win.webContents.executeJavaScript('localStorage.removeItem("ai-dashboard-tabs"); location.reload()')
    }
  })

  registerShortcut(config.shortcut)
  createTray()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
