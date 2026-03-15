import type { GetConversationListSuccess, GetQaInfoSuccess, SessionType } from '../../constants/qa'
import instance, { type CommonResponse } from '../../utils/http'
import type { GetConversationListParams, GetQaInfoParams, StreamQaParams } from './types'

const BASE_URL = 'https://xiaoanjihua.cc'

const authHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `${token}` } : {}
}

/** SSE 流式响应单条数据结构 */
interface SSEChunk {
  delta?: string
  finished?: boolean
  code?: number
  message?: string
}

/** 流式问答接口 - 解析 SSE 流，通过 onChunk 回调逐块返回内容 */
export const streamQaStream = async (
  params: StreamQaParams,
  onChunk: (delta: string, finished: boolean) => void,
): Promise<void> => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE_URL}/api/qa/sse/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ?{ Authorization: `${token}` } : {}),
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }
  
  // 读取响应流 getReader()
  // fetch 专门的 处理流式响应的 方法
  const reader = res.body?.getReader()
  if (!reader) {
    throw new Error('无法读取响应流')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // console.log('value', value)
      buffer += decoder.decode(value, { stream: true })
      // console.log('buffer', buffer)

      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonStr = line.slice(5).trim()
          if (jsonStr === '[DONE]' || !jsonStr) continue
          try {
            const data = JSON.parse(jsonStr) as SSEChunk
            const delta = data.delta ?? ''
            const finished = data.finished ?? false
            onChunk(delta, finished)
          } catch {
            // 忽略解析失败的行
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/** 获取或创建问答会话 */
export const getOrCreateSession = () => {
  return instance.get<CommonResponse<SessionType>>('/api/qa/get-or-create-session', {}, { header: authHeader() })
}

/** 流式问答接口（兼容旧逻辑，非流式时使用） */
export const streamQa = (params: StreamQaParams) => {
  return instance.post<CommonResponse<Record<string, unknown>>>('/api/qa/sse/ask', params, { header: authHeader() })
}

/** 获取问答信息列表 */
export const getQaInfo = (params: GetQaInfoParams) => {
  return instance.get<CommonResponse<GetQaInfoSuccess>>('/api/qa/get-messages', params, { header: authHeader() })
}

/** 获取对话信息列表 */
export const getConversationList = (params: GetConversationListParams) => {
  return instance.get<CommonResponse<GetConversationListSuccess>>('/api/qa/get-sessions', params, { header: authHeader() })
}
