import { Tab } from '../store'

interface StatusBarProps {
  activeTab: Tab
}

export function StatusBar({ activeTab }: StatusBarProps) {
  return (
    <div style={styles.container}>
      <span style={styles.url}>{activeTab.name} — {activeTab.url}</span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1e1f2e',
    padding: '0 12px',
    height: 28,
    fontSize: 11,
    color: '#9399b2',
    userSelect: 'none',
    flexShrink: 0,
  },
  url: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}
