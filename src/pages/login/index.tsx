import { useEffect, useId, useMemo, useState } from 'react'
import {
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { App, Button, Form, Input, Space } from 'antd'
import { getUserInfo, login, register, sendEmailCode } from '@/api/auth'
import { LoginType } from '@/constants/auth'
import type { RegisterSuccess, UserInfo } from '@/constants/auth'
import type { CommonResponse } from '@/utils/http'
import {
  getErrorMessage,
  getMessageFromApiBody,
  saveLoginInfo,
  setStoredUser,
  unwrapResponse,
} from '@/utils/appState'
import {
  validateEmail,
  validateEmailCode,
  validateInviteCode,
  validateLoginPassword,
  validateRegisterPassword,
} from '@/utils/authValidation'
import { useNavigate } from 'react-router-dom'
import './index.css'

type AuthMode = 'login' | 'register'

type FormNotice = { tone: 'error' | 'success'; text: string } | null

/** 注册接口错误提示：顶部 Message，约 3s 后自动关闭 */
const REGISTER_TOAST_DURATION = 3.2

/** 验证码发送成功提示 */
const SEND_CODE_SUCCESS_TOAST_DURATION = 2.5

/** 发送邮箱验证码后的等待秒数（与按钮内环、进度一致） */
const SEND_CODE_COUNTDOWN_SEC = 60

const CD_RING_R = 14
const CD_RING_C = 2 * Math.PI * CD_RING_R

/** 发送验证码按钮：环形进度 + 居中秒数 + 说明（优化展示） */
function SendCodeCountdownLabel({ sec }: { sec: number }) {
  const gid = useId().replace(/:/g, '')
  const gradId = `login-cd-grad-${gid}`
  const offset = CD_RING_C * (1 - sec / SEND_CODE_COUNTDOWN_SEC)

  return (
    <span
      className="login-code-cd"
      role="status"
      aria-live="polite"
      aria-label={`${sec} 秒后可重新获取验证码`}
    >
      <span className="login-code-cd__ringBox" aria-hidden>
        <svg className="login-code-cd__svg" width="40" height="40" viewBox="0 0 40 40">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6d5efc" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
          </defs>
          <circle
            className="login-code-cd__track"
            cx="20"
            cy="20"
            r={CD_RING_R}
            fill="none"
            stroke="#ede9fe"
            strokeWidth="2.75"
          />
          <circle
            className="login-code-cd__progress"
            cx="20"
            cy="20"
            r={CD_RING_R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="2.75"
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
            strokeDasharray={CD_RING_C}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="login-code-cd__num" key={sec}>
          {sec}
        </span>
      </span>
      <span className="login-code-cd__caption">秒后可重发</span>
    </span>
  )
}

function LoginPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [formNotice, setFormNotice] = useState<FormNotice>(null)
  const [sendCodeError, setSendCodeError] = useState('')

  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()

  /** 每秒减 1，依赖链清晰，不随 countdown 变化反复重建 interval */
  useEffect(() => {
    if (countdown <= 0) {
      return
    }
    const id = window.setTimeout(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1))
    }, 1000)
    return () => window.clearTimeout(id)
  }, [countdown])

  const panelTitle = useMemo(() => {
    return mode === 'login' ? '账号登录' : '邮箱注册'
  }, [mode])

  const clearFormNotice = () => setFormNotice(null)

  const handleLogin = async (email?: string, password?: string) => {
    try {
      const values = await loginForm.validateFields()
      const finalEmail = email ?? values.email
      const finalPassword = password ?? values.password

      setLoading(true)
      clearFormNotice()
      const response = await login({
        email: finalEmail.trim(),
        password: finalPassword.trim(),
        type: LoginType.password,
      })
      const data = unwrapResponse(response)
      if (!data?.token) {
        setFormNotice({ tone: 'error', text: '登录响应异常，请稍后重试' })
        return
      }
      saveLoginInfo(data)

      try {
        const infoRes = await getUserInfo({ user_id: data.user.user_id })
        const infoData = unwrapResponse(infoRes as unknown as Parameters<typeof unwrapResponse>[0]) as
          | UserInfo
          | { user: UserInfo }
          | null
        if (infoData) {
          const fullUser =
            typeof infoData === 'object' && infoData !== null && 'user' in infoData
              ? infoData.user
              : (infoData as UserInfo)
          setStoredUser(fullUser)
        }
      } catch {
        // getUserInfo 失败不影响登录流程
      }

      window.setTimeout(() => navigate('/me', { replace: true, state: { justLoggedIn: true } }), 500)
    } catch (error) {
      if (error instanceof Error && error.message === 'validateFields') {
        return
      }
      console.log(error)
      setFormNotice({ tone: 'error', text: getErrorMessage(error, '登录失败，请稍后再试') })
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    setSendCodeError('')
    const raw = registerForm.getFieldValue('email')
    const email = typeof raw === 'string' ? raw.trim() : ''
    const emailErr = validateEmail(email)
    if (emailErr) {
      registerForm.setFields([{ name: 'email', errors: [emailErr] }])
      setSendCodeError(emailErr)
      try {
        registerForm.scrollToField('email', { block: 'center' })
      } catch {
        // ignore
      }
      return
    }
    registerForm.setFields([{ name: 'email', errors: [] }])

    try {
      setSendingCode(true)
      clearFormNotice()
      const res = (await sendEmailCode({ email })) as CommonResponse<Record<string, never>>
      if (typeof res.code === 'number' && res.code !== 0 && res.code !== 200) {
        setSendCodeError(getMessageFromApiBody(res, '验证码发送失败，请稍后再试'))
        return
      }
      message.open({
        type: 'success',
        content: '验证码已发送',
        duration: SEND_CODE_SUCCESS_TOAST_DURATION,
      })
      setCountdown(SEND_CODE_COUNTDOWN_SEC)
    } catch (error) {
      setSendCodeError(getErrorMessage(error, '验证码发送失败，请稍后再试'))
    } finally {
      setSendingCode(false)
    }
  }

  const handleRegister = async () => {
    try {
      const values = await registerForm.validateFields()

      setLoading(true)
      clearFormNotice()
      const res = (await register({
        email: values.email.trim(),
        email_code: values.email_code.trim(),
        invite_code_used: values.invite_code_used.trim(),
        password: values.password.trim(),
      })) as CommonResponse<RegisterSuccess>

      if (typeof res.code === 'number' && res.code !== 0 && res.code !== 200) {
        message.open({
          type: 'error',
          content: getMessageFromApiBody(res, '注册失败，请稍后再试'),
          duration: REGISTER_TOAST_DURATION,
        })
        return
      }

      loginForm.setFieldsValue({
        email: values.email.trim(),
        password: values.password.trim(),
      })
      setMode('login')
      await handleLogin(values.email.trim(), values.password.trim())
    } catch (error) {
      if (error instanceof Error && error.message === 'validateFields') {
        return
      }
      console.log(error)
      message.open({
        type: 'error',
        content: getErrorMessage(error, '注册失败，请检查验证码或邀请码'),
        duration: REGISTER_TOAST_DURATION,
      })
    } finally {
      setLoading(false)
    }
  }

  const resetModeSwitch = (next: AuthMode) => {
    const currentEmail = next === 'login'
      ? registerForm.getFieldValue('email')
      : loginForm.getFieldValue('email')

    setMode(next)
    clearFormNotice()
    setSendCodeError('')

    if (next === 'login') {
      registerForm.resetFields()
      if (currentEmail) {
        loginForm.setFieldsValue({ email: currentEmail })
      }
    } else {
      loginForm.resetFields()
      if (currentEmail) {
        registerForm.setFieldsValue({ email: currentEmail })
      }
    }
  }

  const emailRules = useMemo(
    () => [
      {
        validator: (_: unknown, value: unknown) => {
          const err = validateEmail(value)
          return err ? Promise.reject(new Error(err)) : Promise.resolve()
        },
      },
    ],
    []
  )

  const loginPasswordRules = useMemo(
    () => [
      {
        validator: (_: unknown, value: unknown) => {
          const err = validateLoginPassword(value)
          return err ? Promise.reject(new Error(err)) : Promise.resolve()
        },
      },
    ],
    []
  )

  const emailCodeRules = useMemo(
    () => [
      {
        validator: (_: unknown, value: unknown) => {
          const err = validateEmailCode(value)
          return err ? Promise.reject(new Error(err)) : Promise.resolve()
        },
      },
    ],
    []
  )

  const inviteCodeRules = useMemo(
    () => [
      {
        validator: (_: unknown, value: unknown) => {
          const err = validateInviteCode(value)
          return err ? Promise.reject(new Error(err)) : Promise.resolve()
        },
      },
    ],
    []
  )

  const registerPasswordRules = useMemo(
    () => [
      {
        validator: (_: unknown, value: unknown) => {
          const err = validateRegisterPassword(value)
          return err ? Promise.reject(new Error(err)) : Promise.resolve()
        },
      },
    ],
    []
  )

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
              onClick={() => resetModeSwitch('login')}
              type="button"
            >
              登录
            </button>
            <button
              className={`login-mode-switch__button${mode === 'register' ? ' is-active' : ''}`}
              onClick={() => resetModeSwitch('register')}
              type="button"
            >
              注册
            </button>
          </div>

          <div
            className="login-form-shell"
            style={{ display: mode === 'login' ? 'block' : 'none' }}
            aria-hidden={mode !== 'login'}
          >
            <Form
              noValidate
              form={loginForm}
              className="login-form"
              onFinish={() => void handleLogin()}
              autoComplete="on"
            >
              <Form.Item
                name="email"
                rules={emailRules}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input
                  prefix={<MailOutlined className="login-field__icon" />}
                  type="text"
                  inputMode="email"
                  autoCapitalize="off"
                  placeholder="请输入邮箱"
                  autoComplete="email"
                  size="large"
                  onChange={() => clearFormNotice()}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={loginPasswordRules}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input.Password
                  prefix={<LockOutlined className="login-field__icon" />}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  size="large"
                  onChange={() => clearFormNotice()}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && loginForm.submit()}
                />
              </Form.Item>

              {formNotice ? (
                <p className={`login-form-notice login-form-notice--${formNotice.tone}`} role="alert">
                  {formNotice.text}
                </p>
              ) : null}

              <button
                className="login-submit"
                disabled={loading}
                onClick={() => loginForm.submit()}
                type="button"
              >
                {loading ? '登录中...' : '立即登录'}
              </button>
            </Form>
          </div>
          <div
            className="login-form-shell"
            style={{ display: mode === 'register' ? 'block' : 'none' }}
            aria-hidden={mode !== 'register'}
          >
            <Form
              noValidate
              form={registerForm}
              className="login-form"
              onFinish={() => void handleRegister()}
              autoComplete="on"
            >
              <Form.Item
                name="email"
                rules={emailRules}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input
                  prefix={<MailOutlined className="login-field__icon" />}
                  type="text"
                  inputMode="email"
                  autoCapitalize="off"
                  placeholder="请输入注册邮箱"
                  autoComplete="email"
                  size="large"
                  onChange={() => {
                    clearFormNotice()
                    setSendCodeError('')
                  }}
                />
              </Form.Item>

              <Form.Item className="login-code-block">
                <Space.Compact block className="login-code-compact">
                  <Form.Item
                    name="email_code"
                    noStyle
                    rules={emailCodeRules}
                    validateTrigger={['onBlur', 'onChange']}
                  >
                    <Input
                      className="login-code-input"
                      prefix={<SafetyCertificateOutlined className="login-field__icon" />}
                      placeholder="请填写邮件中收到的验证码"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      size="large"
                      onChange={() => clearFormNotice()}
                    />
                  </Form.Item>
                  <Button
                    className={`login-code-button${countdown > 0 ? ' login-code-button--countdown' : ''}`}
                    type="default"
                    htmlType="button"
                    disabled={sendingCode || countdown > 0}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      void handleSendCode()
                    }}
                  >
                    {countdown > 0 ? (
                      <SendCodeCountdownLabel sec={countdown} />
                    ) : sendingCode ? (
                      '发送中...'
                    ) : (
                      '发送验证码'
                    )}
                  </Button>
                </Space.Compact>
              </Form.Item>
              {sendCodeError ? <p className="login-field__error">{sendCodeError}</p> : null}

              <Form.Item
                name="invite_code_used"
                rules={inviteCodeRules}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Input
                  prefix={<IdcardOutlined className="login-field__icon" />}
                  placeholder="请输入邀请码"
                  autoComplete="off"
                  size="large"
                  onChange={() => clearFormNotice()}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={registerPasswordRules}
                validateTrigger="onBlur"
              >
                <Input.Password
                  prefix={<LockOutlined className="login-field__icon" />}
                  placeholder="6～12 位，须含英文大小写与数字"
                  autoComplete="new-password"
                  size="large"
                  onChange={() => clearFormNotice()}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && registerForm.submit()}
                />
              </Form.Item>

              {formNotice ? (
                <p className={`login-form-notice login-form-notice--${formNotice.tone}`} role="alert">
                  {formNotice.text}
                </p>
              ) : null}

              <button
                className="login-submit"
                disabled={loading}
                onClick={() => registerForm.submit()}
                type="button"
              >
                {loading ? '提交中...' : '完成注册'}
              </button>
            </Form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
