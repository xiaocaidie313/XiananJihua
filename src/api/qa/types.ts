/** 流式问答参数类型 */
export interface StreamQaParams {
  content: string
  session_id: number
  client_message_id: string
}

/** 获取问答信息参数类型 */
export interface GetQaInfoParams {
  session_id: number
  page_size: number
  cursor: string
  user_id: number
}

/** 获取对话信息列表参数类型 */
export interface GetConversationListParams {
  page_size: number
  cursor: string
  user_id: number
}
