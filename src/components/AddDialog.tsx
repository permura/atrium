import { useState } from 'react'

interface AddDialogProps {
  onAdd: (name: string, url: string, emoji: string) => void
  onClose: () => void
}

interface QuickProvider {
  name: string
  url: string
  emoji: string
}

const quickProviders: QuickProvider[] = [
  { name: 'ChatGPT', url: 'https://chatgpt.com', emoji: '🤖' },
  { name: 'Gemini', url: 'https://gemini.google.com/app', emoji: '🌟' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com', emoji: '🔍' },
  { name: '豆包', url: 'https://www.doubao.com/chat', emoji: '🫘' },
  { name: '千问', url: 'https://tongyi.aliyun.com/qianwen', emoji: '💡' },
  { name: 'Kimi', url: 'https://kimi.moonshot.cn', emoji: '🌙' },
  { name: 'Claude', url: 'https://claude.ai', emoji: '🧠' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai', emoji: '🔎' },
  { name: 'Grok', url: 'https://x.com/i/grok', emoji: '🚀' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com', emoji: '💻' },
  { name: 'Mistral', url: 'https://chat.mistral.ai', emoji: '🌪️' },
  { name: '文心一言', url: 'https://yiyan.baidu.com', emoji: '📜' },
  { name: '元宝', url: 'https://yuanbao.tencent.com', emoji: '💰' },
  { name: '星火', url: 'https://xinghuo.xfyun.cn', emoji: '🔥' },
  { name: '混元', url: 'https://hunyuan.tencent.com', emoji: '☁️' },
  { name: 'Pi', url: 'https://pi.ai', emoji: '🤗' },
]

function getFavicon(url: string, size = 20) {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${size}`
  } catch {
    return ''
  }
}

const emojiOptions = ['🌐', '🤖', '💬', '🧠', '✨', '💡', '🔮', '📚', '⚡', '🎯']

export function AddDialog({ onAdd, onClose }: AddDialogProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('https://')
  const [emoji, setEmoji] = useState('🌐')

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed || !url.trim()) return
    onAdd(trimmed, url.trim(), emoji)
    onClose()
  }

  const handleQuickAdd = (p: QuickProvider) => {
    onAdd(p.name, p.url, p.emoji)
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>添加 AI 厂商</h3>

        <p style={styles.sectionLabel}>一键添加</p>
        <div style={styles.quickGrid}>
          {quickProviders.map((p) => (
            <button
              key={p.name}
              style={styles.quickBtn}
              onClick={() => handleQuickAdd(p)}
              title={p.url}
            >
              <img
                src={getFavicon(p.url)}
                style={styles.quickIcon}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                alt=""
              />
              <span style={styles.quickEmoji}>{p.emoji}</span>
              <span style={styles.quickName}>{p.name}</span>
            </button>
          ))}
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>或自定义</span>
        </div>

        <label style={styles.label}>名称</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：Claude"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <label style={styles.label}>网址</label>
        <input
          style={styles.input}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://claude.ai"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <label style={styles.label}>图标</label>
        <div style={styles.emojiGrid}>
          {emojiOptions.map((e) => (
            <button
              key={e}
              style={{
                ...styles.emojiOption,
                ...(emoji === e ? styles.emojiSelected : {}),
              }}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>取消</button>
          <button style={styles.confirmBtn} onClick={handleSubmit} disabled={!name.trim() || !url.trim()}>
            添加
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  dialog: {
    background: '#2a2b3d',
    borderRadius: 12,
    padding: 24,
    width: 440,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  title: {
    color: '#cdd6f4',
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 14px 0',
  },
  sectionLabel: {
    color: '#9399b2',
    fontSize: 12,
    marginBottom: 8,
  },
  quickGrid: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  quickBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: '#1e1f2e',
    border: '1px solid #45475a',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    color: '#cdd6f4',
    fontSize: 13,
  },
  quickIcon: {
    width: 18,
    height: 18,
  },
  quickEmoji: {
    fontSize: 16,
    lineHeight: 1,
    display: 'none',
  },
  quickName: {
    fontWeight: 500,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '16px 0',
    gap: 10,
  },
  dividerText: {
    color: '#585b70',
    fontSize: 11,
    flexShrink: 0,
    paddingRight: 10,
  },
  label: {
    display: 'block',
    color: '#9399b2',
    fontSize: 12,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #45475a',
    background: '#1e1f2e',
    color: '#cdd6f4',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  },
  emojiGrid: {
    display: 'flex',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  emojiOption: {
    background: 'transparent',
    border: '2px solid #45475a',
    borderRadius: 8,
    fontSize: 22,
    cursor: 'pointer',
    padding: '4px 8px',
    transition: 'border-color 0.15s',
  },
  emojiSelected: {
    borderColor: '#89b4fa',
    background: 'rgba(137,180,250,0.15)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #45475a',
    color: '#9399b2',
    padding: '6px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
  },
  confirmBtn: {
    background: '#89b4fa',
    border: 'none',
    color: '#1e1f2e',
    padding: '6px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
}
