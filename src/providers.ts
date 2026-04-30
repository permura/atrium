export interface Provider {
  id: string
  name: string
  url: string
  emoji: string
}

export const defaultProviders: Provider[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    emoji: '🤖',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    emoji: '🌟',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    emoji: '🔍',
  },
  {
    id: 'doubao',
    name: '豆包',
    url: 'https://www.doubao.com/chat',
    emoji: '🫘',
  },
  {
    id: 'qianwen',
    name: '千问',
    url: 'https://tongyi.aliyun.com/qianwen',
    emoji: '💡',
  },
  {
    id: 'kimi',
    name: 'Kimi',
    url: 'https://kimi.moonshot.cn',
    emoji: '🌙',
  },
]
