import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './dialog.css'

interface DialogProps {
  message: string
  role: 'user' | 'assistant'
  time?: string
}

function Dialog(props: DialogProps) {
  const { message, role, time } = props
  const isOwn = role === 'user'

  return (
    <div
      className={`chat-message-row${isOwn ? ' is-own' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        width: '100%',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          width: '100%',
          padding: '0 8px',
        }}
      >
        {time && (
          <span
            className="chat-message-time"
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '6px',
            }}
          >
            {time}
          </span>
        )}
      </div>
      <div
        className={`chat-message-bubble-wrap${isOwn ? ' is-own' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          marginBottom: '12px',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          width: '100%',
          padding: '0 8px',
        }}
      >
        <div
          className={`chat-message-bubble${isOwn ? ' is-own' : ''}`}
          style={{
            maxWidth: '72%',
            padding: '14px 16px',
            borderRadius: '18px',
            wordWrap: 'break-word',
            backgroundColor: isOwn ? '#5b4bdb' : '#f8fafc',
            color: isOwn ? 'white' : '#1f2937',
            border: isOwn ? 'none' : '1px solid #e5e7eb',
            boxShadow: isOwn ? '0 12px 24px rgba(91, 75, 219, 0.22)' : 'none',
            borderBottomRightRadius: isOwn ? '6px' : '18px',
            borderBottomLeftRadius: isOwn ? '18px' : '6px',
          }}
        >
          {isOwn ? (
            <span style={{ fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {message || ''}
            </span>
          ) : (
            <div className="chat-md">
              {message ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
              ) : (
                <span className="chat-md-placeholder">...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(Dialog)
