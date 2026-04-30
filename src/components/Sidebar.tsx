function getFavicon(url: string, size = 32) {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${size}`
  } catch {
    return ''
  }
}

interface ProviderInfo {
  url: string
  name: string
  emoji: string
  count: number
}

interface SidebarProps {
  providers: ProviderInfo[]
  activeUrl: string
  onSwitchProvider: (url: string) => void
  onAdd: () => void
  onRefresh: () => void
  onSettings: () => void
}

export function Sidebar({
  providers,
  activeUrl,
  onSwitchProvider,
  onAdd,
  onRefresh,
  onSettings,
}: SidebarProps) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.providers}>
        {providers.map((p) => (
          <button
            key={p.url}
            style={{
              ...styles.providerBtn,
              ...(p.url === activeUrl ? styles.providerActive : {}),
            }}
            onClick={() => onSwitchProvider(p.url)}
            title={`${p.name} (${p.count} 个标签)`}
          >
            <img
              src={getFavicon(p.url)}
              style={styles.icon}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
                ;(e.target as HTMLImageElement).nextElementSibling?.setAttribute('style', 'display:inline')
              }}
              alt=""
            />
            <span style={{ ...styles.iconFallback, display: 'none' }}>{p.emoji}</span>
            {p.count > 1 && <span style={styles.badge}>{p.count}</span>}
          </button>
        ))}
      </div>
      <div style={styles.spacer} />
      <button style={styles.toolBtn} onClick={onAdd} title="添加厂商">
        +
      </button>
      <button style={styles.toolBtn} onClick={onRefresh} title="刷新">
        ↻
      </button>
      <button style={styles.toolBtn} onClick={onSettings} title="设置">
        ⚙
      </button>
    </div>
  )
}

const SIDEBAR_W = 52

const styles: Record<string, React.CSSProperties & { WebkitAppRegion?: string }> = {
  sidebar: {
    width: SIDEBAR_W,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#1a1b2e',
    padding: '8px 0',
    userSelect: 'none',
    flexShrink: 0,
    gap: 2,
  },
  providers: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  providerBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    transition: 'background 0.15s',
    WebkitAppRegion: 'no-drag' as const,
  },
  providerActive: {
    background: 'rgba(137,180,250,0.15)',
    borderLeft: '3px solid #89b4fa',
    borderRadius: '0 10px 10px 0',
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconFallback: {
    fontSize: 20,
    lineHeight: 1,
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    background: '#89b4fa',
    color: '#1a1b2e',
    fontSize: 9,
    fontWeight: 700,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 3px',
  },
  spacer: {
    flex: 1,
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: '#9399b2',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s',
    WebkitAppRegion: 'no-drag' as const,
  },
}
