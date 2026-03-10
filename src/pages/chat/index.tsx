import { useEffect, useState } from 'react'
import { getOrCreateSession, getQaInfo, streamQa } from '@/api/qa'
import { getConversationList } from '@/api/qa'
import {
  getChatSessionId,
  getCurrentUserId,
  getErrorMessage,
  setChatSession,
  unwrapResponse,
} from '@/utils/appState'
import Dialog from './components/dialog'
import BottomInput from './components/bottomInput'

export interface Message {
  id: number
  message: string
  role: 'user' | 'assistant'
  time: string
}

function Chat() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState(0)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [sending, setSending] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const currentUserId = getCurrentUserId()
  const isLoggedIn = Boolean(currentUserId)

  const formatTime = (value: number | string | undefined) => {
    const date = value ? new Date(Number(value)) : new Date()
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  useEffect(() => {
    let active = true

    const initChat = async () => {
      if (!isLoggedIn) {
        setMessages([
          {
            id: 1,
            message: '请先登录后再开始 AI 对话，我会根据你的账号会话记录继续服务。',
            role: 'assistant',
            time: formatTime(Date.now()),
          },
        ])
        setLoadingMessages(false)
        return
      }

      try {
        setLoadingMessages(true)
        let currentSessionId = getChatSessionId()

        if (!currentSessionId) {
          const sessionResponse = await getOrCreateSession()
          const sessionData = unwrapResponse(sessionResponse)
          setChatSession(sessionData)
          currentSessionId = sessionData.session.session_id
        }

        if (!active) {
          return
        }

        setSessionId(currentSessionId)

        const [messageResponse, sessionListResponse] = await Promise.all([
          getQaInfo({
            session_id: currentSessionId,
            page_size: 50,
            cursor: '',
            user_id: currentUserId,
          }),
          getConversationList({
            page_size: 20,
            cursor: '',
            user_id: currentUserId,
          }),
        ])

        const messageData = unwrapResponse(messageResponse)
        const sessionListData = unwrapResponse(sessionListResponse)

        if (!active) {
          return
        }

        setSessionCount((sessionListData.sessions || []).length)
        setMessages(
          (messageData.messages || []).map((item, index) => ({
            id: index + 1,
            message: item.content,
            role: item.user_id === currentUserId ? 'user' : 'assistant',
            time: formatTime(item.created_at),
          })),
        )
        setFeedback('')
      } catch (error) {
        if (active) {
          setFeedback(getErrorMessage(error, '聊天记录加载失败，请稍后再试'))
          setMessages([])
        }
      } finally {
        if (active) {
          setLoadingMessages(false)
        }
      }
    }

    void initChat()

    return () => {
      active = false
    }
  }, [currentUserId, isLoggedIn])

  const handleSend = async (value: string) => {
    if (!value.trim() || !isLoggedIn) {
      return
    }

    const now = Date.now()
    const clientMessageId = `client_${now}`
    const userMessage: Message = {
      id: now,
      message: value,
      role: 'user',
      time: formatTime(now),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setSending(true)

    try {
      let currentSessionId = sessionId

      if (!currentSessionId) {
        const sessionResponse = await getOrCreateSession()
        const sessionData = unwrapResponse(sessionResponse)
        setChatSession(sessionData)
        currentSessionId = sessionData.session.session_id
        setSessionId(currentSessionId)
      }

      const response = await streamQa({
        content: value,
        session_id: currentSessionId,
        client_message_id: clientMessageId,
      })
      const data = unwrapResponse<any>(response)
      const assistantText =
        typeof data === 'string'
          ? data
          : data?.content || data?.answer || data?.message?.content || '收到你的消息啦'

      setMessages((prev) => [
        ...prev,
        {
          id: now + 1,
          message: assistantText,
          role: 'assistant',
          time: formatTime(Date.now()),
        },
      ])
      setFeedback('')
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: now + 1,
          message: '消息发送失败，请稍后再试',
          role: 'assistant',
          time: formatTime(Date.now()),
        },
      ])
      setFeedback(getErrorMessage(error, '消息发送失败，请稍后再试'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-shell">
      <section className="page-hero">
        <span className="soft-tag">AI 对话</span>
        <h1 className="page-title" style={{ marginTop: '16px' }}>网页端对话工作台</h1>
        <p className="page-subtitle">现在会优先接入真实会话接口、历史消息接口和发送接口，未登录时会显示登录提示。</p>
      </section>

      <div className="page-content-grid">
        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>当前会话</div>
            <div className="info-stack">
              <div className="info-row"><strong>登录状态</strong><span>{isLoggedIn ? '已登录' : '未登录'}</span></div>
              <div className="info-row"><strong>会话数</strong><span>{sessionCount}</span></div>
              <div className="info-row"><strong>消息数</strong><span>{messages.length}</span></div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>说明</div>
            <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#64748b' }}>
              {isLoggedIn
                ? '当前页面已对接真实 QA 接口，会自动恢复最近会话并继续对话。'
                : '请先登录，系统才会为你创建并读取个人会话。'}
            </div>
          </div>
        </aside>

        <section
          className="surface-card"
          style={{
            minHeight: '720px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="section-title">小安对话</div>
              <div className="section-meta">真实会话 / 真实消息 / 真实发送</div>
            </div>
            <span className="soft-tag">{messages.length} 条消息</span>
          </div>

          {feedback && (
            <div style={{ margin: '16px 24px 0', fontSize: '13px', color: '#b45309' }}>
              {feedback}
            </div>
          )}

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {loadingMessages ? (
              <div style={{ padding: '0 24px', color: '#94a3b8' }}>消息加载中...</div>
            ) : (
              messages.map((msg) => (
                <Dialog
                  key={msg.id}
                  message={msg.message}
                  role={msg.role}
                  time={msg.time}
                />
              ))
            )}
          </div>

          <BottomInput
            disabled={!isLoggedIn}
            inputValue={inputValue}
            loading={sending}
            onSend={(value) => void handleSend(value)}
            setInputValue={setInputValue}
          />
        </section>
      </div>
    </div>
  )
}

export default Chat