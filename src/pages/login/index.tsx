import { useEffect, useMemo, useState } from 'react'
import { login, register, sendEmailCode } from '@/api/auth'
import { LoginType } from '@/constants/auth'
import { getErrorMessage, saveLoginInfo, unwrapResponse } from '@/utils/appState'
import { useNavigate } from 'react-router-dom'

type AuthMode = 'login' | 'register'

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [registerForm, setRegisterForm] = useState({
    email: '',
    email_code: '',
    invite_code_used: '',
    password: '',
  })

  useEffect(() => {
    if (!countdown) {
      return
    }

    const timer = window.setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          return 0
        }

        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [countdown])

  const panelTitle = useMemo(() => {
    return mode === 'login' ? '账号登录' : '邮箱注册'
  }, [mode])

  const handleLogin = async (email = loginForm.email, password = loginForm.password) => {
    if (!email.trim() || !password.trim()) {
      setFeedback('请先填写邮箱和密码')
      return
    }

    try {
      setLoading(true)
      const response = await login({
        email: email.trim(),
        password: password.trim(),
        type: LoginType.password,
      })
      const data = unwrapResponse(response)
      saveLoginInfo(data)
      setFeedback('登录成功，正在跳转个人中心')
      window.setTimeout(() => navigate('/me'), 500)
    } catch (error) {
      setFeedback(getErrorMessage(error, '登录失败，请稍后再试'))
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    if (!registerForm.email.trim()) {
      setFeedback('请先输入注册邮箱')
      return
    }

    try {
      setSendingCode(true)
      await sendEmailCode({ email: registerForm.email.trim() })
      setFeedback('验证码已发送，请前往邮箱查收')
      setCountdown(60)
    } catch (error) {
      setFeedback(getErrorMessage(error, '验证码发送失败，请稍后重试'))
    } finally {
      setSendingCode(false)
    }
  }

  const handleRegister = async () => {
    if (!registerForm.email.trim() || !registerForm.email_code.trim() || !registerForm.password.trim()) {
      setFeedback('请完整填写邮箱、验证码和密码')
      return
    }

    if (!registerForm.invite_code_used.trim()) {
      setFeedback('请输入邀请码')
      return
    }

    try {
      setLoading(true)
      await register({
        email: registerForm.email.trim(),
        email_code: registerForm.email_code.trim(),
        invite_code_used: registerForm.invite_code_used.trim(),
        password: registerForm.password.trim(),
      })
      setFeedback('注册成功，正在为你自动登录')
      setLoginForm({
        email: registerForm.email.trim(),
        password: registerForm.password.trim(),
      })
      setMode('login')
      await handleLogin(registerForm.email.trim(), registerForm.password.trim())
    } catch (error) {
      setFeedback(getErrorMessage(error, '注册失败，请检查验证码或邀请码'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <section className="page-hero">
        <span className="soft-tag">认证中心</span>
        <h1 className="page-title" style={{ marginTop: '16px' }}>
          完整登录与注册能力已经补上
        </h1>
        <p className="page-subtitle">
          支持账号密码登录、邮箱验证码注册、登录态持久化。登录成功后会直接写入本地 token 和用户信息。
        </p>
      </section>

      <div className="page-content-grid">
        <section className="surface-card" style={{ padding: '28px', minWidth: 0 }}>
          <div className="section-head">
            <div>
              <div className="section-title">欢迎来到小安</div>
              <div className="section-meta">网页端已经补齐独立认证入口</div>
            </div>
            <span className="soft-tag">{panelTitle}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginTop: '20px' }}>
            <button
              className={`header-action${mode === 'login' ? '' : ' subtle'}`}
              onClick={() => setMode('login')}
              type="button"
            >
              登录
            </button>
            <button
              className={`header-action${mode === 'register' ? '' : ' subtle'}`}
              onClick={() => setMode('register')}
              type="button"
            >
              注册
            </button>
          </div>

          {feedback && (
            <div
              style={{
                marginTop: '18px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: '14px',
              }}
            >
              {feedback}
            </div>
          )}

          {mode === 'login' ? (
            <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="email"
                placeholder="邮箱"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                className="search-input"
                style={{ height: '50px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px' }}
              />
              <input
                type="password"
                placeholder="密码"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                className="search-input"
                style={{ height: '50px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px' }}
              />
              <button className="header-action" disabled={loading} onClick={() => void handleLogin()} type="button">
                {loading ? '登录中...' : '立即登录'}
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="email"
                placeholder="注册邮箱"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                className="search-input"
                style={{ height: '50px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 148px', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="邮箱验证码"
                  value={registerForm.email_code}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, email_code: event.target.value }))}
                  className="search-input"
                  style={{ height: '50px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px' }}
                />
                <button
                  className="header-action subtle"
                  disabled={sendingCode || countdown > 0}
                  onClick={() => void handleSendCode()}
                  type="button"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : sendingCode ? '发送中...' : '发送验证码'}
                </button>
              </div>

              <input
                type="text"
                placeholder="邀请码"
                value={registerForm.invite_code_used}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, invite_code_used: event.target.value }))}
                className="search-input"
                style={{ height: '50px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px' }}
              />
              <input
                type="password"
                placeholder="设置密码"
                value={registerForm.password}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                className="search-input"
                style={{ height: '50px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px' }}
              />
              <button className="header-action" disabled={loading} onClick={() => void handleRegister()} type="button">
                {loading ? '提交中...' : '完成注册'}
              </button>
            </div>
          )}
        </section>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>本次补齐的能力</div>
            <div className="info-stack">
              <div className="info-row"><strong>登录</strong><span>邮箱 + 密码</span></div>
              <div className="info-row"><strong>注册</strong><span>邮箱验证码 + 邀请码</span></div>
              <div className="info-row"><strong>状态持久化</strong><span>token / user</span></div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>下一步使用</div>
            <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#64748b' }}>
              登录成功后，可以直接进入个人中心查看用户信息，也可以进入 AI 对话页开始真实会话。
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default LoginPage
