import home from './assets/home-icon.png'
import chatgpt from './assets/icons/chatgpt.png'
import gemini from './assets/icons/gemini.png'
import deepseek from './assets/icons/deepseek.png'
import doubao from './assets/icons/doubao.png'
import qianwen from './assets/icons/qianwen.png'
import kimi from './assets/icons/kimi.png'
import claude from './assets/icons/claude.png'
import perplexity from './assets/icons/perplexity.png'
import grok from './assets/icons/grok.png'
import copilot from './assets/icons/copilot.png'
import mistral from './assets/icons/mistral.png'
import wenxin from './assets/icons/wenxin.png'
import yuanbao from './assets/icons/yuanbao.png'
import xinghuo from './assets/icons/xinghuo.png'
import hunyuan from './assets/icons/hunyuan.png'
import pi from './assets/icons/pi.png'

const iconMap: Record<string, string> = {
  'chatgpt.com': chatgpt,
  'gemini.google.com': gemini,
  'chat.deepseek.com': deepseek,
  'www.doubao.com': doubao,
  'tongyi.aliyun.com': qianwen,
  'kimi.moonshot.cn': kimi,
  'claude.ai': claude,
  'www.perplexity.ai': perplexity,
  'x.com': grok,
  'copilot.microsoft.com': copilot,
  'chat.mistral.ai': mistral,
  'yiyan.baidu.com': wenxin,
  'yuanbao.tencent.com': yuanbao,
  'xinghuo.xfyun.cn': xinghuo,
  'hunyuan.tencent.com': hunyuan,
  'pi.ai': pi,
}

const HOME_KEY = 'atrium://home'

export function getIcon(url: string): string {
  if (url === HOME_KEY) return home
  try {
    const host = new URL(url).hostname
    return iconMap[host] ?? ''
  } catch {
    return ''
  }
}
