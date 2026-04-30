import { useState, useCallback } from 'react'
import { useStore } from './store'
import { Sidebar } from './components/Sidebar'
import { TabBar } from './components/TabBar'
import { WebViewPanel } from './components/WebViewPanel'
import { StatusBar } from './components/StatusBar'
import { AddDialog } from './components/AddDialog'
import { SettingsDialog } from './components/SettingsDialog'

export default function App() {
  const {
    tabs,
    activeTab,
    activeTabId,
    providers,
    activeProviderTabs,
    switchTab,
    switchProvider,
    addTab,
    removeTab,
    reorderTabs,
  } = useStore()

  const [refreshKey, setRefreshKey] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const handleAdd = useCallback(
    (name: string, url: string, emoji: string) => {
      addTab(name, url, emoji)
    },
    [addTab],
  )

  const handleAddInstance = useCallback(() => {
    if (activeTab) {
      addTab(activeTab.name.replace(/ \d+$/, ''), activeTab.url, activeTab.emoji)
    }
  }, [activeTab, addTab])

  return (
    <div style={styles.root}>
      <Sidebar
        providers={providers}
        activeUrl={activeTab?.url ?? ''}
        onSwitchProvider={switchProvider}
        onAdd={() => setShowAdd(true)}
        onRefresh={handleRefresh}
        onSettings={() => setShowSettings(true)}
      />
      <div style={styles.main}>
        <TabBar
          tabs={activeProviderTabs}
          activeTabId={activeTabId}
          onSwitch={switchTab}
          onRemove={removeTab}
          onReorder={reorderTabs}
          onAddInstance={handleAddInstance}
        />
        <div style={styles.content}>
          {tabs.map((tab) => (
            <WebViewPanel
              key={tab.id}
              tabId={tab.id}
              url={tab.url}
              active={tab.id === activeTabId}
              refreshKey={tab.id === activeTabId ? refreshKey : 0}
            />
          ))}
        </div>
        <StatusBar activeTab={activeTab} />
      </div>
      {showAdd && (
        <AddDialog onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {showSettings && (
        <SettingsDialog onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    height: '100vh',
    background: '#252536',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
}
