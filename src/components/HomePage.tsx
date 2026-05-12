export function HomePage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Atrium</h1>
        <p style={styles.subtitle}>所有 AI，一个窗口</p>

        <div style={styles.features}>
          <Feature icon="🔗" title="多厂商聚合" desc="ChatGPT、Claude、Gemini、DeepSeek 等主流 AI 一站式访问" />
          <Feature icon="🗂️" title="多标签管理" desc="同一厂商支持多个独立会话，标签可拖拽排序" />
          <Feature icon="⚡" title="全局快捷键" desc="Cmd+Shift+Space 一键呼出/隐藏，随时使用" />
          <Feature icon="🔒" title="隐私安全" desc="数据完全本地存储，不上传任何信息" />
        </div>

        <div style={styles.footer}>
          <span style={styles.version}>v1.0.0</span>
          <span style={styles.tech}>Electron 33 + React 18 + TypeScript</span>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={styles.feature}>
      <span style={styles.featureIcon}>{icon}</span>
      <div>
        <div style={styles.featureTitle}>{title}</div>
        <div style={styles.featureDesc}>{desc}</div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FFFFFF',
  },
  card: {
    textAlign: 'center',
    maxWidth: 420,
    padding: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1D1D1F',
    margin: 0,
  },
  subtitle: {
    fontSize: 15,
    color: '#6E6E73',
    marginTop: 8,
    marginBottom: 36,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    textAlign: 'left',
  },
  feature: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 24,
    lineHeight: 1,
    flexShrink: 0,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1D1D1F',
  },
  featureDesc: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  footer: {
    marginTop: 36,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 11,
    color: '#AEAEB2',
  },
  version: {
    fontWeight: 500,
  },
  tech: {},
}
