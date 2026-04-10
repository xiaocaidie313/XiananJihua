import type { SessionInfo } from '@/constants/qa'
import './history.css'

interface HistoryProps {
  sessions: SessionInfo[]
  currentSessionId: number
  onNewChat: () => void
  onSelectSession: (sessionId: number) => void
  disabled?: boolean
}

function History({ sessions, currentSessionId, onNewChat, onSelectSession, disabled }: HistoryProps) {
  return (
    <aside className="chat-history">
      <div className="chat-history__top">
        <div className="chat-history__title">对话记录</div>
        <button
          type="button"
          className="chat-history__new-btn"
          onClick={onNewChat}
          disabled={disabled}
        >
          + 新对话
        </button>
      </div>
      <div className="chat-history__list">
        {sessions.length === 0 ? (
          <div className="chat-history__empty">暂无历史会话</div>
        ) : (
          sessions.map((s, idx) => (
            <button
              key={s.session_id < 0 ? `placeholder-${s.session_id}` : `${s.session_id}-${idx}`}
              type="button"
              className={`chat-history__item${s.session_id === currentSessionId ? ' is-active' : ''}`}
              onClick={() => onSelectSession(s.session_id)}
              disabled={disabled}
            >
              <span className="chat-history__item-title" title={s.title}>
                {s.title || `会话 ${s.session_id}`}
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}

export default History
