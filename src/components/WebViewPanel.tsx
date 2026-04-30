import { useRef, useEffect } from 'react'

interface WebViewPanelProps {
  tabId: string
  url: string
  active: boolean
  refreshKey: number
}

export function WebViewPanel({ tabId, url, active, refreshKey }: WebViewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const existing = container.querySelector('webview') as unknown as {
      src: string; reload: () => void; setAttribute: (k: string, v: string) => void;
      addEventListener: (e: string, fn: () => void) => void;
      executeJavaScript: (js: string) => void;
    } | null

    if (!existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wv = document.createElement('webview') as any
      wv.src = url
      wv.style.width = '100%'
      wv.style.height = '100%'
      wv.style.border = 'none'
      wv.style.outline = 'none'
      wv.setAttribute('allowpopups', 'true')
      wv.addEventListener('dom-ready', () => {
        wv.executeJavaScript(`
          window.addEventListener('click', function(e) {
            var a = e.target.closest('a');
            if (a && a.target === '_blank') { e.preventDefault(); }
          }, true);
        `)
      })
      container.appendChild(wv)
    }
  }, [tabId, url])

  useEffect(() => {
    if (refreshKey === 0) return
    const wv = containerRef.current?.querySelector('webview') as { reload: () => void } | null
    wv?.reload()
  }, [refreshKey])

  return (
    <div
      ref={containerRef}
      style={{
        display: active ? 'flex' : 'none',
        flex: 1,
        overflow: 'hidden',
        background: '#1e1f2e',
      }}
    />
  )
}
