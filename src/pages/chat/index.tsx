import { useCallback, useEffect, useRef, useState } from 'react'
import { getOrCreateSession, getQaInfo, streamQaStream, getConversationList } from '@/api/qa'
import type { SessionInfo, SessionType } from '@/constants/qa'
import { getCurrentUserId, getErrorMessage, unwrapResponse } from '@/utils/appState'
import Dialog from './components/dialog'
import BottomInput from './components/bottomInput'
import './index.css'

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
  const [, setSessions] = useState<SessionInfo[]>([])
  const [feedback, setFeedback] = useState('')
  const currentUserId = getCurrentUserId()
  const isLoggedIn = Boolean(currentUserId)
  const messagesScrollRef = useRef<HTMLDivElement>(null)

  const formatTime = (value: number | string | undefined) => {
    const date = value ? new Date(Number(value)) : new Date()
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const ensureSessionId = useCallback(async (fallbackFeedback: string) => {
    if (sessionId && sessionId > 0) {
      return sessionId
    }
    try {
      const sessionResponse = await getOrCreateSession()
      const sessionData = unwrapResponse<SessionType | null>(sessionResponse)

      if (!sessionData?.session?.session_id) {
        throw new Error(fallbackFeedback)
      }

      const realSession = sessionData.session
      const placeholderId = sessionId
      setSessionId(realSession.session_id)
      setSessions((prev) =>
        prev.map((s) => (s.session_id === placeholderId ? realSession : s)),
      )
      return realSession.session_id
    } catch (err) {
      console.log(err)
      throw new Error(fallbackFeedback)
    }
  }, [sessionId])

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
        // 获取会话列表
        const sessionListResponse = await getConversationList({
          page_size: 20,
          cursor: '',
          user_id: currentUserId,
        })
        const sessionListData = unwrapResponse(sessionListResponse)
        const sessions = sessionListData?.sessions ?? []

        let currentSessionId: number
        if (sessions.length > 0) {
          currentSessionId = sessions[0].session_id
        } else {
          currentSessionId = await ensureSessionId('会话创建失败，请稍后重试')
        }

        if (!active) {
          return
        }
        // 设置当前会话id
        setSessionId(currentSessionId)

        const messageResponse = await getQaInfo({
          session_id: currentSessionId,
          page_size: 50,
          cursor: '',
          user_id: currentUserId,
        })
        const messageData = unwrapResponse(messageResponse)

        if (!active) {
          return
        }

        setSessions(sessions)
        const rawMessages = messageData?.messages ?? []
        setMessages(
          rawMessages.map((item, index) => ({
            id: index + 1,
            message: item.content,
            role: (index % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
            time: formatTime(item.created_at),
          })),
        )
        setFeedback('')
      } catch (error) {
        console.log(error)
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
  }, [currentUserId, ensureSessionId, isLoggedIn])

  useEffect(() => {
    if (!loadingMessages && messages.length > 0) {
      requestAnimationFrame(() => {
        const el = messagesScrollRef.current
        if (el) el.scrollTop = el.scrollHeight
      })
    }
  }, [loadingMessages, messages])

  const refreshSessions = useCallback(async () => {
    if (!currentUserId) return
    try {
      const res = await getConversationList({ page_size: 20, cursor: '', user_id: currentUserId })
      const data = unwrapResponse(res)
      setSessions(data?.sessions ?? [])
    } catch (err) {
      console.log(err)
    }
  }, [currentUserId])

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

    const assistantMessageId = now + 1
    // 先用两条信息 占位  ， 有道理
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        message: '',
        role: 'assistant',
        time: formatTime(Date.now()),
      },
    ])
    setInputValue('')
    setSending(true)

    try {
      const currentSessionId = await ensureSessionId('当前无法创建对话会话，请稍后再试')

      let accumulatedText = ''
      await streamQaStream(
        {
          content: value,
          session_id: currentSessionId,
          client_message_id: clientMessageId,
        },
        (delta, finished) => {
          accumulatedText += delta
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, message: accumulatedText } : msg,
            ),
          )
          if (finished) {
            setFeedback('')
            void refreshSessions()
          }
        },
      )
    } catch (error) {
      console.log(error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, message: '消息发送失败，请稍后再试' }
            : msg,
        ),
      )
      setFeedback(getErrorMessage(error, '消息发送失败，请稍后再试'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-layout">
        {/* {isLoggedIn && (
          <History
            sessions={sessions}
            currentSessionId={sessionId}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            disabled={loadingMessages}
          />
        )} */}
        <section className="chat-shell">
          <div className="chat-shell__topbar">
          <div>
            <div className="chat-shell__title">小安对话</div>
            <div className="chat-shell__subtitle">
              {isLoggedIn
                ? '小安会根据你的问题，给出相应的回答。'
                : '请先登录，登录后即可恢复你的历史会话并继续聊天。'}
            </div>
          </div>
          {/* <div className="chat-shell__meta">
            <span className="soft-tag">{isLoggedIn ? '已登录' : '未登录'}</span>
            <span className="soft-tag">{messages.length} 条消息</span>
            <span className="soft-tag">{sessions.length} 个会话</span>
          </div> */}
        </div>

        {feedback && <div className="chat-shell__feedback">{feedback}</div>}
 
        <div ref={messagesScrollRef} className="chat-shell__messages">
          <div className="chat-shell__messages-inner">
            {loadingMessages ? (
              <div className="chat-shell__placeholder">消息加载中...</div>
            ) : messages.length ? (
              messages.map((msg) => (
                <Dialog
                  key={msg.id}
                  message={msg.message}
                  role={msg.role}
                  time={msg.time}
                />
              ))
            ) : (
              <div className="chat-shell__empty">
                <div className="chat-shell__empty-title">开始和小安聊一聊</div>
                <div className="chat-shell__empty-desc">
                  小安会根据你的问题，给出相应的回答。
                </div>
              </div>
            )}
          </div>
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