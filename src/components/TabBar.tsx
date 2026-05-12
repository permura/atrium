import { useState, DragEvent } from 'react'
import { Tab } from '../store'

interface TabBarProps {
  tabs: Tab[]
  activeTabId: string
  onSwitch: (id: string) => void
  onRemove: (id: string) => void
  onReorder: (tabId: string, beforeTabId: string) => void
  onAddInstance: () => void
}

export function TabBar({
  tabs,
  activeTabId,
  onSwitch,
  onRemove,
  onReorder,
  onAddInstance,
}: TabBarProps) {
  const [dragId, setDragId] = useState<string | null>(null)

  const handleDragStart = (e: DragEvent, id: string) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e: DragEvent, id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragId && dragId !== id) {
      onReorder(dragId, id)
      setDragId(id)
    }
  }

  if (tabs.length === 0) return null

  return (
    <div style={styles.container}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          draggable
          style={{
            ...styles.tab,
            ...(tab.id === activeTabId ? styles.tabActive : {}),
            ...(dragId === tab.id ? styles.dragging : {}),
          }}
          onClick={() => onSwitch(tab.id)}
          onDragStart={(e) => handleDragStart(e, tab.id)}
          onDragOver={(e) => handleDragOver(e, tab.id)}
          onDragEnd={() => setDragId(null)}
        >
          <span style={styles.label}>{tab.name}</span>
          <button
            style={styles.closeBtn}
            onClick={(e) => {
              e.stopPropagation()
              onRemove(tab.id)
            }}
            title="关闭"
          >
            ×
          </button>
        </div>
      ))}
      <button style={styles.addBtn} onClick={onAddInstance} title="新建实例">
        +
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties & { WebkitAppRegion?: string }> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '0 8px',
    height: 36,
    background: '#F3F3F5',
    userSelect: 'none',
    overflow: 'auto',
    borderBottom: '1px solid #E5E5EA',
    flexShrink: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px 4px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    color: '#6E6E73',
    background: 'transparent',
    flexShrink: 0,
    WebkitAppRegion: 'no-drag' as const,
  },
  tabActive: {
    color: '#1D1D1F',
    background: 'rgba(0,122,255,0.08)',
    fontWeight: 600,
  },
  dragging: {
    opacity: 0.4,
  },
  label: {
    fontWeight: 500,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#98989E',
    cursor: 'pointer',
    fontSize: 15,
    lineHeight: 1,
    padding: '0 2px',
    borderRadius: 3,
  },
  addBtn: {
    background: 'none',
    border: '1px dashed #D1D1D6',
    color: '#98989E',
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: 1,
    width: 24,
    height: 24,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    WebkitAppRegion: 'no-drag' as const,
  },
}
