import { useState, useEffect, useCallback } from 'react'

interface SettingsDialogProps {
  onClose: () => void
}

type Config = {
  shortcut: string
  startMinimized: boolean
  autoLaunch: boolean
}

export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const [shortcut, setShortcut] = useState('')
  const [recording, setRecording] = useState(false)
  const [shortcutSaved, setShortcutSaved] = useState(false)
  const [shortcutError, setShortcutError] = useState('')
  const [startMinimized, setStartMinimized] = useState(false)
  const [autoLaunch, setAutoLaunch] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    window.electronAPI?.getConfig().then((cfg: Config) => {
      setShortcut(cfg.shortcut)
      setStartMinimized(cfg.startMinimized)
      setAutoLaunch(cfg.autoLaunch)
      setLoaded(true)
    })
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!recording) return
      e.preventDefault()
      e.stopPropagation()
      const key = e.key
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) return
      const parts: string[] = []
      if (e.ctrlKey) parts.push('Ctrl')
      if (e.altKey) parts.push('Alt')
      if (e.shiftKey) parts.push('Shift')
      if (e.metaKey) parts.push('Cmd')
      parts.push(key.length === 1 ? key.toUpperCase() : key)
      setShortcut(parts.join('+'))
      setRecording(false)
    },
    [recording],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown])

  const saveShortcut = async () => {
    if (!shortcut) return
    setShortcutError('')
    const ok = await window.electronAPI?.setShortcut(shortcut)
    if (ok) {
      setShortcutSaved(true)
      setTimeout(() => setShortcutSaved(false), 1500)
    } else {
      setShortcutError('快捷键已被占用或格式无效')
    }
  }

  const toggleStartMinimized = async () => {
    const val = !startMinimized
    setStartMinimized(val)
    await window.electronAPI?.setConfig('startMinimized', val)
  }

  const toggleAutoLaunch = async () => {
    const val = !autoLaunch
    setAutoLaunch(val)
    await window.electronAPI?.setConfig('autoLaunch', val)
  }

  const handleClearCache = async () => {
    await window.electronAPI?.clearCache()
  }

  const handleResetTabs = async () => {
    await window.electronAPI?.resetTabs()
  }

  if (!loaded) return null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>设置</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.body}>
          {/* Shortcut */}
          <Section label="通用" />
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span style={styles.rowLabel}>全局快捷键</span>
              <span style={styles.rowDesc}>呼出 / 隐藏应用窗口</span>
            </div>
            <div style={styles.shortcutRow}>
              <div
                style={{
                  ...styles.shortcutDisplay,
                  ...(recording ? styles.recording : {}),
                }}
                onClick={() => setRecording(true)}
              >
                {recording ? '按下组合键...' : shortcut}
              </div>
              <button
                style={styles.miniBtn}
                onClick={() => setRecording((r) => !r)}
              >
                {recording ? '取消' : '录制'}
              </button>
              <button
                style={{
                  ...styles.miniBtn,
                  background: shortcutSaved ? '#34C759' : 'transparent',
                  color: shortcutSaved ? '#1D1D1F' : '#007AFF',
                  borderColor: '#007AFF',
                }}
                onClick={saveShortcut}
              >
                {shortcutSaved ? '✓' : '保存'}
              </button>
            </div>
          </div>
          {shortcutError && <p style={styles.error}>{shortcutError}</p>}

          {/* Startup */}
          <Section label="启动" />
          <SettingRow
            label="启动到托盘"
            desc="启动时不显示窗口，仅显示托盘图标"
            enabled={startMinimized}
            onToggle={toggleStartMinimized}
          />
          <SettingRow
            label="开机自启动"
            desc="系统登录时自动启动 Atrium"
            enabled={autoLaunch}
            onToggle={toggleAutoLaunch}
          />

          {/* Data */}
          <Section label="数据" />
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span style={styles.rowLabel}>重置厂商列表</span>
              <span style={styles.rowDesc}>删除自定义标签，恢复默认的 6 家预设厂商</span>
            </div>
            <button style={styles.dangerBtn} onClick={handleResetTabs}>
              重置
            </button>
          </div>
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span style={styles.rowLabel}>清除缓存</span>
              <span style={styles.rowDesc}>清除所有 webview 的 cookie 和存储数据</span>
            </div>
            <button style={styles.dangerBtn} onClick={handleClearCache}>
              清除
            </button>
          </div>

          {/* About */}
          <Section label="关于" />
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span style={styles.rowLabel}>Atrium</span>
              <span style={styles.rowDesc}>v1.0.0</span>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span style={styles.rowLabel}>技术栈</span>
              <span style={styles.rowDesc}>Electron 33 + React 18 + TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ label }: { label: string }) {
  return (
    <div style={styles.section}>
      <span>{label}</span>
      <div style={styles.sectionLine} />
    </div>
  )
}

function SettingRow({
  label,
  desc,
  enabled,
  onToggle,
}: {
  label: string
  desc: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div style={styles.row}>
      <div style={styles.rowLeft}>
        <span style={styles.rowLabel}>{label}</span>
        <span style={styles.rowDesc}>{desc}</span>
      </div>
      <button
        style={{
          ...styles.toggle,
          background: enabled ? '#34C759' : '#D1D1D6',
        }}
        onClick={onToggle}
        title={enabled ? '已开启' : '已关闭'}
      >
        <span
          style={{
            ...styles.toggleKnob,
            transform: enabled ? 'translateX(20px)' : 'translateX(2px)',
          }}
        />
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  dialog: {
    background: '#FFFFFF',
    borderRadius: 12,
    width: 520,
    maxHeight: '80vh',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #E5E5EA',
    flexShrink: 0,
  },
  title: {
    color: '#1D1D1F',
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#8E8E93',
    fontSize: 20,
    cursor: 'pointer',
    width: 28,
    height: 28,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    overflow: 'auto',
    padding: '8px 20px 20px',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    marginBottom: 8,
    color: '#007AFF',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    background: '#E5E5EA',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    gap: 12,
  },
  rowLeft: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    display: 'block',
    color: '#1D1D1F',
    fontSize: 13,
    fontWeight: 500,
  },
  rowDesc: {
    display: 'block',
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2,
  },
  shortcutRow: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    flexShrink: 0,
  },
  shortcutDisplay: {
    width: 150,
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #D1D1D6',
    background: '#F5F5F7',
    color: '#1D1D1F',
    fontSize: 13,
    fontFamily: 'monospace',
    cursor: 'pointer',
    textAlign: 'center',
    userSelect: 'none',
  },
  recording: {
    borderColor: '#007AFF',
    color: '#007AFF',
  },
  miniBtn: {
    background: 'transparent',
    border: '1px solid #D1D1D6',
    color: '#6E6E73',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
  error: {
    color: '#FF3B30',
    fontSize: 11,
    marginTop: 2,
    paddingLeft: 2,
  },
  toggle: {
    width: 42,
    height: 24,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.2s',
    position: 'relative',
    padding: 0,
  },
  toggleKnob: {
    display: 'block',
    width: 20,
    height: 20,
    borderRadius: 10,
    background: '#FFFFFF',
    transition: 'transform 0.2s',
  },
  dangerBtn: {
    background: 'transparent',
    border: '1px solid #FF3B30',
    color: '#FF3B30',
    padding: '5px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    flexShrink: 0,
  },
}
