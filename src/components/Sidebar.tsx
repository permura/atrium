import { getIcon } from '../icons'

import { useState, DragEvent, MouseEvent } from 'react'

function ProviderIcon({ url, emoji }: { url: string; emoji: string }) {
  const icon = getIcon(url)
  const [failed, setFailed] = useState(false)

  if (!icon || failed) {
    return <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
  }
  return (
    <img
      src={icon}
      style={{ width: 20, height: 20 }}
      onError={() => setFailed(true)}
      alt=""
    />
  )
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
  homeActive: boolean
  onHome: () => void
  onSwitchProvider: (url: string) => void
  onAdd: () => void
  onRefresh: () => void
  onSettings: () => void
  onReorderProvider: (fromUrl: string, toUrl: string) => void
  onEditProvider: (url: string, name: string, emoji: string, newUrl?: string) => void
  onDeleteProvider: (url: string) => void
  onClearProviderTabs: (url: string) => void
}

const emojiOptions = ['🌐', '🤖', '💬', '🧠', '✨', '💡', '🔮', '📚', '⚡', '🎯']

export function Sidebar({
  providers,
  activeUrl,
  homeActive,
  onHome,
  onSwitchProvider,
  onAdd,
  onRefresh,
  onSettings,
  onReorderProvider,
  onEditProvider,
  onDeleteProvider,
  onClearProviderTabs,
}: SidebarProps) {
  const [dragUrl, setDragUrl] = useState<string | null>(null)
  const [menu, setMenu] = useState<{ x: number; y: number; provider: ProviderInfo } | null>(null)
  const [editing, setEditing] = useState<ProviderInfo | null>(null)
  const [editName, setEditName] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [editEmoji, setEditEmoji] = useState('🌐')

  const handleDragStart = (e: DragEvent, url: string) => {
    setDragUrl(url)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', url)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: DragEvent, targetUrl: string) => {
    e.preventDefault()
    if (dragUrl && dragUrl !== targetUrl) {
      onReorderProvider(dragUrl, targetUrl)
    }
    setDragUrl(null)
  }

  const handleDragEnd = () => {
    setDragUrl(null)
  }

  const handleContextMenu = (e: MouseEvent, p: ProviderInfo) => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, provider: p })
  }

  const handleEdit = (p: ProviderInfo) => {
    setMenu(null)
    setEditing(p)
    setEditName(p.name)
    setEditUrl(p.url)
    setEditEmoji(p.emoji)
  }

  const handleSaveEdit = () => {
    if (editing && editName.trim() && editUrl.trim()) {
      onEditProvider(editing.url, editName.trim(), editEmoji, editUrl.trim())
    }
    setEditing(null)
  }

  const handleClear = (p: ProviderInfo) => {
    setMenu(null)
    if (p.count <= 1) return
    if (confirm(`确定清空「${p.name}」的 ${p.count} 个标签？保留 1 个。`)) {
      onClearProviderTabs(p.url)
    }
  }

  const handleDelete = (p: ProviderInfo) => {
    setMenu(null)
    if (confirm(`确定删除「${p.name}」及其所有 ${p.count} 个标签？`)) {
      onDeleteProvider(p.url)
    }
  }

  const closeMenu = () => setMenu(null)

  return (
    <div style={styles.sidebar} onClick={closeMenu}>
      <div style={styles.providers}>
        {/* Home button */}
        <button
          style={{
            ...styles.providerBtn,
            ...(homeActive ? styles.providerActive : {}),
          }}
          onClick={onHome}
          title="首页"
        >
          <img src={getIcon('atrium://home')} style={{ width: 20, height: 20, borderRadius: 4 }} alt="" />
        </button>

        {providers.map((p) => (
          <button
            key={p.url}
            draggable
            style={{
              ...styles.providerBtn,
              ...(p.url === activeUrl ? styles.providerActive : {}),
              ...(dragUrl === p.url ? styles.dragging : {}),
            }}
            onClick={() => onSwitchProvider(p.url)}
            onDragStart={(e) => handleDragStart(e, p.url)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, p.url)}
            onDragEnd={handleDragEnd}
            onContextMenu={(e) => handleContextMenu(e, p)}
            title={`${p.name} (${p.count} 个标签)`}
          >
            <ProviderIcon url={p.url} emoji={p.emoji} />

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

      {/* Context menu */}
      {menu && (
        <div style={{ ...styles.menu, left: menu.x, top: menu.y }}>
          <button style={styles.menuItem} onClick={() => handleEdit(menu.provider)}>
            编辑
          </button>
          <button
            style={{ ...styles.menuItem, ...(menu.provider.count <= 1 ? { color: '#AEAEB2' } : {}) }}
            onClick={() => handleClear(menu.provider)}
            disabled={menu.provider.count <= 1}
          >
            清空标签
          </button>
          <button style={{ ...styles.menuItem, ...styles.menuDanger }} onClick={() => handleDelete(menu.provider)}>
            删除
          </button>
        </div>
      )}

      {/* Edit dialog */}
      {editing && (
        <div style={styles.overlay} onClick={() => setEditing(null)}>
          <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.dialogTitle}>编辑厂商</h3>
            <label style={styles.label}>名称</label>
            <input
              style={styles.input}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <label style={styles.label}>网址</label>
            <input
              style={styles.input}
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <label style={styles.label}>图标</label>
            <div style={styles.emojiGrid}>
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  style={{
                    ...styles.emojiOption,
                    ...(editEmoji === e ? styles.emojiSelected : {}),
                  }}
                  onClick={() => setEditEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
            <div style={styles.actions}>
              <button style={styles.cancelBtn} onClick={() => setEditing(null)}>取消</button>
              <button style={styles.saveBtn} onClick={handleSaveEdit}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SIDEBAR_W = 52

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: SIDEBAR_W,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#ECECF0',
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
    transition: 'background 0.15s, opacity 0.15s, transform 0.15s, box-shadow 0.15s, border-radius 0.15s',
  },
  providerActive: {
    background: 'rgba(0,122,255,0.12)',
    borderRadius: 10,
    boxShadow: '0 0 0 1px rgba(0,122,255,0.15)',
  },
  dragging: {
    opacity: 0.3,
    transform: 'scale(0.9)',
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
    background: '#007AFF',
    color: '#FFFFFF',
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
    color: '#8E8E93',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s',
  },
  // Context menu
  menu: {
    position: 'fixed',
    background: '#FFFFFF',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    padding: '4px 0',
    minWidth: 100,
    zIndex: 200,
    border: '1px solid #E5E5EA',
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    color: '#1D1D1F',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  menuDanger: {
    color: '#FF3B30',
  },
  // Edit dialog
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
  },
  dialog: {
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: 340,
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
  },
  dialogTitle: {
    color: '#1D1D1F',
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 16px 0',
  },
  label: {
    display: 'block',
    color: '#6E6E73',
    fontSize: 12,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #D1D1D6',
    background: '#F5F5F7',
    color: '#1D1D1F',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  emojiGrid: {
    display: 'flex',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap' as const,
  },
  emojiOption: {
    background: 'transparent',
    border: '2px solid #D1D1D6',
    borderRadius: 8,
    fontSize: 22,
    cursor: 'pointer',
    padding: '4px 8px',
  },
  emojiSelected: {
    borderColor: '#007AFF',
    background: 'rgba(0,122,255,0.10)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #D1D1D6',
    color: '#6E6E73',
    padding: '6px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
  },
  saveBtn: {
    background: '#007AFF',
    border: 'none',
    color: '#FFFFFF',
    padding: '6px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
}
