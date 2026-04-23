import { useEffect, useState } from 'react'
import { getUserInfo } from '@/api/auth'
import type { UserInfo } from '@/constants/auth'
import { getCurrentUserId, getStoredUser, unwrapResponse } from '@/utils/appState'

function pickUserPayload(data: unknown): UserInfo | null {
  if (data == null || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  if (o.user_info && typeof o.user_info === 'object') {
    return o.user_info as unknown as UserInfo
  }
  if ('user_id' in o) return o as unknown as UserInfo
  return null
}

/**
 * 根据创作者 userId 拉取头像（与公开主页一致）。
 * 若当前登录用户即为该创作者，直接使用本地缓存资料，减少请求。
 */
export function useUploaderAvatar(userId: number | null | undefined, skipFetch?: boolean): string | undefined {
  const [avatar, setAvatar] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (skipFetch) {
      queueMicrotask(() => setAvatar(undefined))
      return
    }
    const id = userId != null && userId > 0 ? userId : null
    if (!id) {
      queueMicrotask(() => setAvatar(undefined))
      return
    }

    const myId = getCurrentUserId()
    const self = getStoredUser()
    if (myId === id && self?.avatar) {
      queueMicrotask(() => setAvatar(self.avatar))
      return
    }

    let cancelled = false
    void getUserInfo({ user_id: id })
      .then((res) => {
        const raw = unwrapResponse(res)
        const user = pickUserPayload(raw as unknown)
        if (!cancelled) setAvatar(user?.avatar?.trim() || undefined)
      })
      .catch(() => {
        if (!cancelled) setAvatar(undefined)
      })
    return () => {
      cancelled = true
    }
  }, [userId, skipFetch])

  return avatar
}
