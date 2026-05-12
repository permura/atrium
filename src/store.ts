import { useState, useCallback, useMemo } from 'react'
import { defaultProviders } from './providers'

export interface Tab {
  id: string
  name: string
  url: string
  emoji: string
}

const STORAGE_KEY = 'ai-dashboard-tabs'

let idCounter = Date.now()

function loadTabs(): Tab[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    /* ignore */
  }
  return [...defaultProviders]
}

function saveTabs(tabs: Tab[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
}

export function useStore() {
  const [tabs, setTabs] = useState<Tab[]>(loadTabs)
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id ?? '')

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]

  // Unique providers by URL, preserving order of first appearance
  const providers = useMemo(() => {
    const seen = new Set<string>()
    const result: { url: string; name: string; emoji: string; count: number }[] = []
    for (const t of tabs) {
      if (!seen.has(t.url)) {
        seen.add(t.url)
        // Strip " 2", " 3" suffix for the sidebar display name
        const baseName = t.name.replace(/ \d+$/, '')
        result.push({ url: t.url, name: baseName, emoji: t.emoji, count: 0 })
      }
      const entry = result.find((p) => p.url === t.url)!
      entry.count++
    }
    return result
  }, [tabs])

  // Tabs filtered to the active provider
  const activeProviderTabs = useMemo(
    () => tabs.filter((t) => t.url === activeTab?.url),
    [tabs, activeTab],
  )

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id)
  }, [])

  const switchProvider = useCallback(
    (url: string) => {
      const first = tabs.find((t) => t.url === url)
      if (first) setActiveTabId(first.id)
    },
    [tabs],
  )

  const addTab = useCallback((name: string, url: string, emoji: string) => {
    const id = `custom-${idCounter++}`
    setTabs((prev) => {
      const prefix = name + ' '
      const sameUrl = prev.filter((t) => t.url === url)
      const sameBase = sameUrl.filter(
        (t) => t.name === name || t.name.startsWith(prefix),
      )
      let displayName = name
      if (sameBase.length > 0) {
        const nums = sameBase.map((t) => {
          if (t.name === name) return 0
          const suffix = t.name.slice(prefix.length)
          return /^\d+$/.test(suffix) ? parseInt(suffix) : 0
        })
        displayName = `${name} ${Math.max(...nums, 0) + 1}`
      }
      const next = [...prev, { id, name: displayName, url, emoji }]
      saveTabs(next)
      setActiveTabId(id)
      return next
    })
  }, [])

  const removeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id)
      if (next.length === 0) return prev
      saveTabs(next)
      setActiveTabId((aid) => (aid === id ? next[0].id : aid))
      return next
    })
  }, [])

  const reorderTabs = useCallback((tabId: string, beforeTabId: string) => {
    setTabs((prev) => {
      const fromIdx = prev.findIndex((t) => t.id === tabId)
      const toIdx = prev.findIndex((t) => t.id === beforeTabId)
      if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIdx, 1)
      const newToIdx = next.findIndex((t) => t.id === beforeTabId)
      next.splice(newToIdx, 0, moved)
      saveTabs(next)
      return next
    })
  }, [])

  const reorderProviders = useCallback((fromUrl: string, toUrl: string) => {
    setTabs((prev) => {
      // Get current provider order from tabs
      const seen = new Set<string>()
      const providerOrder: string[] = []
      for (const t of prev) {
        if (!seen.has(t.url)) {
          seen.add(t.url)
          providerOrder.push(t.url)
        }
      }

      const fromIdx = providerOrder.indexOf(fromUrl)
      const toIdx = providerOrder.indexOf(toUrl)
      if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return prev

      // Move fromUrl to before toUrl
      providerOrder.splice(fromIdx, 1)
      const insertAt = providerOrder.indexOf(toUrl)
      providerOrder.splice(insertAt, 0, fromUrl)

      // Group tabs by URL, preserving relative order within each group
      const groups = new Map<string, Tab[]>()
      for (const t of prev) {
        if (!groups.has(t.url)) groups.set(t.url, [])
        groups.get(t.url)!.push(t)
      }

      // Rebuild tabs array in new provider order
      const next: Tab[] = []
      for (const url of providerOrder) {
        next.push(...(groups.get(url) ?? []))
      }
      saveTabs(next)
      return next
    })
  }, [])

  const editProvider = useCallback((url: string, name: string, emoji: string, newUrl?: string) => {
    setTabs((prev) => {
      const targetUrl = newUrl?.trim() || url
      if (targetUrl !== url) {
        // Prevent merging into existing provider
        const existing = prev.find((t) => t.url === targetUrl)
        if (existing && targetUrl !== url) return prev
      }
      const next = prev.map((t) => {
        if (t.url !== url) return t
        const base = t.name.replace(/ \d+$/, '')
        const suffix = t.name.slice(base.length)
        return { ...t, url: targetUrl, name: name + suffix, emoji }
      })
      saveTabs(next)
      return next
    })
  }, [])

  const deleteProvider = useCallback((url: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.url !== url)
      if (next.length === 0) return prev
      saveTabs(next)
      setActiveTabId((aid) => {
        const stillExists = next.find((t) => t.id === aid)
        return stillExists ? aid : next[0].id
      })
      return next
    })
  }, [])

  const clearProviderTabs = useCallback((url: string) => {
    setTabs((prev) => {
      const providerTabs = prev.filter((t) => t.url === url)
      if (providerTabs.length <= 1) return prev
      // Keep only the first tab, reset its name
      const baseName = providerTabs[0].name.replace(/ \d+$/, '')
      const next = prev.map((t) => {
        if (t.url !== url) return t
        if (t.id === providerTabs[0].id) return { ...t, name: baseName }
        return null as unknown as Tab
      }).filter(Boolean)
      saveTabs(next)
      setActiveTabId((aid) => {
        const stillExists = next.find((t) => t.id === aid)
        return stillExists ? aid : next[0].id
      })
      return next
    })
  }, [])

  return {
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
  }
}
