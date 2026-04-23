import axios from 'axios'
import type { LoginSuccess, UserInfo } from '../constants/auth'
import type { CommonResponse } from './http'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const PROFILE_BACKUP_PREFIX = 'xiaoan:profile:'
export const USER_UPDATED_EVENT = 'xiaoan:user-updated'

/** 专注返回 data 里面的东西 */
export function unwrapResponse<T>(response: CommonResponse<T> | T): T {
  if (response && typeof response === 'object' && 'data' in (response as CommonResponse<T>)) {
    return (response as CommonResponse<T>).data
  }

  return response as T
}

/** 从常见接口/网关错误体中取出可读文案 */
function pickApiMessageFromBody(data: unknown): string | null {
  if (data == null) return null
  if (typeof data === 'string') {
    const t = data.trim()
    return t || null
  }
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>
    const m = o.message ?? o.msg ?? o.error
    if (typeof m === 'string' && m.trim()) return m.trim()
  }
  return null
}

/** 从统一响应体取 message（用于业务 code !== 0 且 HTTP 仍为 200 等场景） */
export function getMessageFromApiBody(data: unknown, fallback: string): string {
  return pickApiMessageFromBody(data) || fallback
}

export function getErrorMessage(error: unknown, fallback = '操作失败，请稍后再试') {
  if (axios.isAxiosError(error)) {
    const fromBody = pickApiMessageFromBody(error.response?.data)
    if (fromBody) {
      return fromBody
    }
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
      return '网络异常，请检查网络后重试'
    }
    return fallback
  }

  if (error instanceof Error) {
    if (/^Request failed with status code \d+$/i.test(error.message)) {
      return fallback
    }
    if (error.message) {
      return error.message
    }
  }

  return fallback
}

function saveProfileBackup(user: UserInfo) {
  if (!user.user_id) return
  const backup: Record<string, string> = {}
  if (user.avatar) backup.avatar = user.avatar
  if (user.name) backup.name = user.name
  if (Object.keys(backup).length > 0) {
    localStorage.setItem(PROFILE_BACKUP_PREFIX + user.user_id, JSON.stringify(backup))
  }
}

function applyProfileBackup(user: UserInfo): UserInfo {
  if (!user.user_id) return user
  const raw = localStorage.getItem(PROFILE_BACKUP_PREFIX + user.user_id)
  if (!raw) return user
  try {
    const backup = JSON.parse(raw) as Record<string, string>
    const patched = { ...user }
    if (!patched.avatar && backup.avatar) patched.avatar = backup.avatar
    if (!patched.name && backup.name) patched.name = backup.name
    return patched
  } catch {
    return user
  }
}

export function saveLoginInfo(payload: LoginSuccess) {
  localStorage.setItem(TOKEN_KEY, payload.token)
  setStoredUser(payload.user)
}

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getStoredUser(): UserInfo | null {
  const raw = localStorage.getItem(USER_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (parsed.user_info && typeof parsed.user_info === 'object') {
      return parsed.user_info as UserInfo
    }
    return parsed as unknown as UserInfo
  } catch {
    return null
  }
}

export function setStoredUser(user: UserInfo) {
  const merged = applyProfileBackup(user)
  saveProfileBackup(merged)
  localStorage.setItem(USER_KEY, JSON.stringify(merged))
  window.dispatchEvent(new CustomEvent(USER_UPDATED_EVENT, { detail: merged }))
}

export function getCurrentUserId(): number {
  const user = getStoredUser()
  if( typeof user === 'object' && user && 'user_info' in user ) {
    return Number((user as { user_info: UserInfo }).user_info?.user_id || 0)
  }
  return Number(user?.user_id ?? 0)
}

export function clearLoginInfo() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new CustomEvent(USER_UPDATED_EVENT, { detail: null }))
}

/** 将秒或毫秒时间戳统一转为毫秒（<1e12 视为秒） */
export function timestampToMs(ts: number): number {
  return ts < 1e12 ? ts * 1000 : ts
}
