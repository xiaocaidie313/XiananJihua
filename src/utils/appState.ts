import type { LoginSuccess, UserInfo } from '../constants/auth'
import type { CommonResponse } from './http'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function unwrapResponse<T>(response: CommonResponse<T> | T): T {
  if (response && typeof response === 'object' && 'data' in (response as CommonResponse<T>)) {
    return (response as CommonResponse<T>).data
  }

  return response as T
}

export function getErrorMessage(error: unknown, fallback = 'Request failed, please try again later') {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function saveLoginInfo(payload: LoginSuccess) {
  localStorage.setItem(TOKEN_KEY, payload.token)
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
}

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getStoredUser(): UserInfo | null {
  const user = localStorage.getItem(USER_KEY)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user) as UserInfo
  } catch {
    return null
  }
}

export function getCurrentUserId(): number {
  const user = getStoredUser()
  return Number(user?.user_id || 0)
}

export function clearLoginInfo() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/** 将秒或毫秒时间戳统一转为毫秒（<1e12 视为秒） */
export function timestampToMs(ts: number): number {
  return ts < 1e12 ? ts * 1000 : ts
}
