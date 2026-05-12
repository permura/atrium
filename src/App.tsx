import { useState, useCallback } from 'react'
import { useStore } from './store'
import { Sidebar } from './components/Sidebar'
import { TabBar } from './components/TabBar'
import { WebViewPanel } from './components/WebViewPanel'
import { HomePage } from './components/HomePage'
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
    reorderProviders,
    editProvider,
    deleteProvider,
    clearProviderTabs,
  } = useStore()

  const [homeActive, setHomeActive] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleSwitchProvider = useCallback((url: string) => {
    setHomeActive(false)
    switchProvider(url)
  }, [switchProvider])

  const handleHome = useCallback(() => {
    setHomeActive(true)
  }, [])

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

  const activeUrl = homeActive ? '' : (activeTab?.url ?? '')

  return (
    <div style={styles.root}>
      <Sidebar
        providers={providers}
        activeUrl={activeUrl}
        homeActive={homeActive}
        onHome={handleHome}
        onSwitchProvider={handleSwitchProvider}
        onAdd={() => setShowAdd(true)}
        onRefresh={handleRefresh}
        onSettings={() => setShowSettings(true)}
        onReorderProvider={reorderProviders}
        onEditProvider={editProvider}
        onDeleteProvider={deleteProvider}
        onClearProviderTabs={clearProviderTabs}
      />
      <div style={styles.main}>
        {homeActive ? (
          <HomePage />
        ) : (
          <>
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
          </>
        )}
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
    background: '#F3F3F5',
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
