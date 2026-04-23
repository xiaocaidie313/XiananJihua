function trimValue(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v.trim()
  return String(v).trim()
}

/** 注册密码：6～12 位，含大小写与数字，仅允许英文字母与数字 */
export function validateRegisterPassword(password: unknown): string | null {
  const p = trimValue(password)
  if (!p) return '请输入密码'
  if (p.length < 6 || p.length > 13) return '密码长度须为 6～13 位'
  if (!/^[A-Za-z\d]+$/.test(p)) return '密码仅可使用英文大小写字母与数字（不可含空格与符号）'
  if (!/[a-z]/.test(p)) return '密码须至少包含一个小写英文字母'
  if (!/[A-Z]/.test(p)) return '密码须至少包含一个大写英文字母'
  if (!/\d/.test(p)) return '密码须至少包含一个数字'
  return null
}

export function validateEmail(email: unknown): string | null {
  const t = trimValue(email)
  if (!t) return '请输入邮箱'
  const EMAIL_RE = /^[A-Za-z\d][A-Za-z\d._%+-]*@[A-Za-z\d](?:[A-Za-z\d-]*[A-Za-z\d])?(?:\.[A-Za-z\d](?:[A-Za-z\d-]*[A-Za-z\d])?)*\.[A-Za-z]{2,}$/
  if (!EMAIL_RE.test(t)) {
    return '邮箱格式不正确，请填写带「@」的完整地址'
  }
  return null
}

/** 登录页密码：必填即可（兼容历史账号；格式由服务端判定） */
export function validateLoginPassword(password: unknown): string | null {
  if (!trimValue(password)) return '请输入密码'
  return null
}

export function validateEmailCode(code: unknown): string | null {
  const t = trimValue(code)
  if (!t) return '请输入邮箱验证码'
  return null
}

export function validateInviteCode(code: unknown): string | null {
  const t = trimValue(code)
  if (!t) return '请输入邀请码'
  return null
}
