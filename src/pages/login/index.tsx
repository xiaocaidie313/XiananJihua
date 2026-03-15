import { useEffect, useMemo, useState } from 'react'
import {
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { login, register, sendEmailCode } from '@/api/auth'
import { LoginType } from '@/constants/auth'
import { getErrorMessage, saveLoginInfo, unwrapResponse } from '@/utils/appState'
import { useNavigate } from 'react-router-dom'
import './index.css'

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
      if (!data?.token) {
        setFeedback('登录响应异常，请稍后重试')
        return
      }
      saveLoginInfo(data)
      setFeedback('登录成功，正在跳转个人中心')
      window.setTimeout(() => navigate('/me', { replace: true, state: { justLoggedIn: true } }), 500)
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
    <div className="login-page">
      <div className="login-center">
        <section className="surface-card login-panel">
          <div className="section-head">
            <div>
              <div className="section-title">欢迎来到小安</div>
            </div>
            <span className="soft-tag">{panelTitle}</span>
          </div>

          <div className="login-mode-switch">
            <button
              className={`login-mode-switch__button${mode === 'login' ? ' is-active' : ''}`}
              onClick={() => setMode('login')}
              type="button"
            >
              登录
            </button>
            <button
              className={`login-mode-switch__button${mode === 'register' ? ' is-active' : ''}`}
              onClick={() => setMode('register')}
              type="button"
            >
              注册
            </button>
          </div>

          {feedback && (
            <div className="login-feedback">
              {feedback}
            </div>
          )}

          {mode === 'login' ? (
            <div className="login-form">
              <label className="login-field">
                <span className="login-field__label">邮箱账号</span>
                <div className="login-field__control">
                  <span className="login-field__icon"><MailOutlined /></span>
                  <input
                    type="email"
                    placeholder="请输入邮箱"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="login-field__input"
                  />
                </div>
              </label>
              <label className="login-field">
                <span className="login-field__label">登录密码</span>
                <div className="login-field__control">
                  <span className="login-field__icon"><LockOutlined /></span>
                  <input
                    type="password"
                    placeholder="请输入密码"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="login-field__input"
                  />
                </div>
              </label>
              <button className="login-submit" disabled={loading} onClick={() => void handleLogin()} type="button">
                {loading ? '登录中...' : '立即登录'}
              </button>
            </div>
          ) : (
            <div className="login-form">
              <label className="login-field">
                <span className="login-field__label">注册邮箱</span>
                <div className="login-field__control">
                  <span className="login-field__icon"><MailOutlined /></span>
                  <input
                    type="email"
                    placeholder="请输入注册邮箱"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="login-field__input"
                  />
                </div>
              </label>

              <div className="login-code-row">
                <label className="login-field">
                  <span className="login-field__label">邮箱验证码</span>
                  <div className="login-field__control">
                    <span className="login-field__icon"><SafetyCertificateOutlined /></span>
                    <input
                      type="text"
                      placeholder="输入验证码"
                      value={registerForm.email_code}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, email_code: event.target.value }))}
                      className="login-field__input"
                    />
                  </div>
                </label>
                <button
                  className="login-code-button"
                  disabled={sendingCode || countdown > 0}
                  onClick={() => void handleSendCode()}
                  type="button"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : sendingCode ? '发送中...' : '发送验证码'}
                </button>
              </div>

              <label className="login-field">
                <span className="login-field__label">邀请码</span>
                <div className="login-field__control">
                  <span className="login-field__icon"><IdcardOutlined /></span>
                  <input
                    type="text"
                    placeholder="请输入邀请码"
                    value={registerForm.invite_code_used}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, invite_code_used: event.target.value }))}
                    className="login-field__input"
                  />
                </div>
              </label>
              <label className="login-field">
                <span className="login-field__label">设置密码</span>
                <div className="login-field__control">
                  <span className="login-field__icon"><LockOutlined /></span>
                  <input
                    type="password"
                    placeholder="设置登录密码"
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="login-field__input"
                  />
                </div>
              </label>
              <button className="login-submit" disabled={loading} onClick={() => void handleRegister()} type="button">
                {loading ? '提交中...' : '完成注册'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default LoginPage
