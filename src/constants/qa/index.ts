/** 会话信息 */
export interface SessionInfo {
  session_id: number
  title: string
  user_id: number
  message_count: number
  has_message: number
  session_status: number
  is_pinned: number
  qpinned_at: number
  last_message_at: number
  relation_status: number
  created_at: number
  updated_at: number
}

/** 会话类型 */
export interface SessionType {
  session: SessionInfo
}

/** 问答信息 */
export interface QaInfo {
  message_id: string
  session_id: number
  user_id: number
  status: number
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  message_type: number
  content: string
  finish_reason: string
  created_at: number
  updated_at: number
}

/** 获取问答信息成功类型 */
export interface GetQaInfoSuccess {
  messages: QaInfo[]
  has_more: boolean
  next_cursor: number
}

/** 获取会话列表成功类型 */
export interface GetConversationListSuccess {
  sessions: SessionInfo[]
  has_more: boolean
  next_cursor: number
}
