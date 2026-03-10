import { SendIcon } from '@/components/icon'

function BottomInput({
  inputValue,
  disabled = false,
  loading = false,
  setInputValue,
  onSend,
}: {
  inputValue: string
  disabled?: boolean
  loading?: boolean
  setInputValue: (value: string) => void
  onSend: (value: string) => void
}) {
  const handleSend = () => {
    if (disabled || loading || !inputValue.trim()) {
      return
    }

    onSend(inputValue.trim())
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px 24px 24px',
        borderTop: '1px solid #eef2f7',
        backgroundColor: '#fff',
      }}
    >
      <div
        className="input-wrapper"
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
          padding: '12px 14px',
          borderRadius: '18px',
          border: '1px solid #e5e7eb',
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <input
          type="text"
          disabled={disabled}
          placeholder={disabled ? '请先登录后再开始对话' : '输入你想聊的话题...'}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            padding: '0 10px',
            backgroundColor: 'transparent',
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend()
            }
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {loading && <span style={{ fontSize: '12px', color: '#64748b' }}>发送中...</span>}
          <SendIcon onClick={handleSend} />
        </div>
      </div>
    </div>
  )
}

export default BottomInput