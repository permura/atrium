# AI Dashboard

一个窗口承载所有 AI 厂商，告别十几个浏览器标签页。

## 功能

- **16 家 AI 厂商** 预置，一键添加，自由增删
- **侧栏 + 画板** 交互 —— 左侧切换厂商，顶部管理同一厂商的多实例
- **拖拽排序** 标签页，调整顺序
- **多实例** 同一模型可开多个标签，自动编号
- **全局快捷键** 呼出/隐藏窗口，自定义快捷键
- **系统托盘** 关闭窗口不退出，后台运行
- **官网 favicon** 自动拉取作为侧栏图标
- **Chrome UA** 伪装，避免被识别为第三方客户端
- **启动到托盘 / 开机自启** 可选

## 预置厂商

| 厂商 | 网站 |
|------|------|
| ChatGPT | chatgpt.com |
| Gemini | gemini.google.com |
| DeepSeek | chat.deepseek.com |
| 豆包 | doubao.com |
| 千问 | tongyi.aliyun.com |
| Kimi | kimi.moonshot.cn |
| Claude | claude.ai |
| Perplexity | perplexity.ai |
| Grok | x.com/i/grok |
| Copilot | copilot.microsoft.com |
| Mistral | chat.mistral.ai |
| 文心一言 | yiyan.baidu.com |
| 元宝 | yuanbao.tencent.com |
| 星火 | xinghuo.xfyun.cn |
| 混元 | hunyuan.tencent.com |
| Pi | pi.ai |

点击左侧栏 `+` 可添加，支持完全自定义（名称 + 网址 + 图标）。

## 界面

```
┌────┬──────────────────────────────────────┐
│ 🤖 │ [ChatGPT] [ChatGPT 2] [+]           │ ← 当前厂商的实例标签
│ 🌟 │ ┌──────────────────────────────────┐ │
│ 🔍 │ │                                  │ │
│ 🫘 │ │         webview 内容             │ │
│ 💡 │ │                                  │ │
│ 🌙 │ └──────────────────────────────────┘ │
│    │  ChatGPT — chatgpt.com              │
│  + │                                      │
│  ↻ │  ← 左侧栏切换厂商 / 刷新 / 设置      │
│  ⚙ │                                      │
└────┴──────────────────────────────────────┘
```

## 技术栈

Electron 33 + React 18 + TypeScript + Vite 6

## 开发

```bash
# 安装依赖
npm install

# 启动开发模式（热更新）
npm run dev

# TypeScript 类型检查
npx tsc --noEmit
```

## 打包

```bash
# macOS（需在 macOS 上执行）
npm run build:mac
# 产物：release/AI Dashboard-1.0.0-macOS.dmg

# Windows
npm run build:win
# 产物：release/AI Dashboard-1.0.0-Setup.exe
```

> Windows 打包 macOS 不支持，反之亦然。需在目标平台上打包，或用 GitHub Actions 做 CI 构建。

如果下载 Electron 慢，设置镜像：

```bash
# macOS / Linux
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install

# Windows (CMD)
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ && npm install
```

## 目录结构

```
ai-dashboard/
├── electron/
│   ├── main.ts          # Electron 主进程（窗口、托盘、快捷键、IPC）
│   └── preload.ts       # 预加载脚本（安全暴露 IPC 接口）
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx       # 左侧厂商侧栏
│   │   ├── TabBar.tsx        # 实例标签栏（拖拽排序）
│   │   ├── WebViewPanel.tsx  # webview 面板
│   │   ├── StatusBar.tsx     # 底部状态栏
│   │   ├── AddDialog.tsx     # 添加厂商弹窗（一键添加 + 自定义）
│   │   └── SettingsDialog.tsx # 设置页
│   ├── providers.ts   # 默认厂商配置
│   ├── store.ts       # 状态管理（标签增删改查、持久化）
│   ├── App.tsx        # 根组件（布局编排）
│   ├── main.tsx       # React 入口
│   └── vite-env.d.ts  # 类型声明
├── index.html
├── package.json
├── vite.config.ts
├── electron-builder.yml  # 打包配置
└── tsconfig.json
```

## 设置

点左下角 ⚙ 打开：

- **通用** — 全局快捷键（录制模式，支持 Ctrl/Alt/Shift/Cmd + 任意键）
- **启动** — 启动到托盘、开机自启动
- **数据** — 重置为默认厂商、清除所有 webview 缓存
- **关于** — 版本信息

## 快捷键

| 功能 | Windows | macOS |
|------|---------|-------|
| 呼出/隐藏 | Ctrl+Shift+Space | Cmd+Shift+Space |
| 关闭标签 | 点击标签上的 × | 点击标签上的 × |
| 拖拽排序 | 按住标签拖拽 | 按住标签拖拽 |

快捷键可在设置页自定义。

## 扩展厂商

编辑 `src/providers.ts`，在数组中追加一项即可：

```ts
{ id: 'custom', name: '新厂商', url: 'https://xxx.com', emoji: '🆕' }
```

或在应用内点 `+` → 自定义表单添加。
