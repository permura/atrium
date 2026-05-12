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

  { name: 'Pi', url: 'https://pi.ai', emoji: '🤗' },
]

import { getIcon } from '../icons'

function QuickIcon({ url, emoji }: { url: string; emoji: string }) {
  const icon = getIcon(url)
  const [failed, setFailed] = useState(false)
  if (!icon || failed) return <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
  return (
    <img
      src={icon}
      style={{ width: 18, height: 18 }}
      onError={() => setFailed(true)}
      alt=""
    />
  )
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
              <QuickIcon url={p.url} emoji={p.emoji} />
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
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  dialog: {
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: 440,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
  },
  title: {
    color: '#1D1D1F',
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 14px 0',
  },
  sectionLabel: {
    color: '#6E6E73',
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
    background: '#F5F5F7',
    border: '1px solid #D1D1D6',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    color: '#1D1D1F',
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
    color: '#8E8E93',
    fontSize: 11,
    flexShrink: 0,
    paddingRight: 10,
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
    border: '2px solid #D1D1D6',
    borderRadius: 8,
    fontSize: 22,
    cursor: 'pointer',
    padding: '4px 8px',
    transition: 'border-color 0.15s',
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
  confirmBtn: {
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
