import type { LoginSuccess, UserInfo } from '../constants/auth'
import type { CommonResponse } from './http'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const PROFILE_BACKUP_PREFIX = 'xiaoan:profile:'
export const USER_UPDATED_EVENT = 'xiaoan:user-updated'

export function unwarpOuterObj<T>( obj :T): object {
  if( typeof obj === "object" && obj ) {
    console.log('我是用户 unwarpOuterObj', obj)
    const result = { ...obj } as object
    console.log('我是用户 result', result)
    return result
  }
  return {} as object
}

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
  const user = localStorage.getItem(USER_KEY)

  if (!user) {
    return null
  }

  try { 
    return JSON.parse(user)['user_info'] as UserInfo
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
  return Number(user?.user_id || 0)
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
