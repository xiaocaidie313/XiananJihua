import type { GetConversationListSuccess, GetQaInfoSuccess, SessionType } from '../../constants/qa'
import instance, { type CommonResponse } from '../../utils/http'
import type { GetConversationListParams, GetQaInfoParams, StreamQaParams } from './types'

/** 获取或创建问答会话 */
export const getOrCreateSession = () => {
  return instance.get<CommonResponse<SessionType>>('/api/qa/get-or-create-session', {})
}

/** 流式问答接口 */
export const streamQa = (params: StreamQaParams) => {
  return instance.post<CommonResponse<Record<string, unknown>>>('/api/qa/stream-qa', params)
}

/** 获取问答信息 */
export const getQaInfo = (params: GetQaInfoParams) => {
  return instance.get<CommonResponse<GetQaInfoSuccess>>('/api/qa/get-messages', params)
}

/** 获取对话信息列表 */
export const getConversationList = (params: GetConversationListParams) => {
  return instance.get<CommonResponse<GetConversationListSuccess>>('/api/qa/get-sessions', params)
}
