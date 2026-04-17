import { useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Spin } from 'antd'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { getUserInfo } from '@/api/auth'
import type { UserInfo } from '@/constants/auth'
import { getCurrentUserId, getErrorMessage, unwrapResponse } from '@/utils/appState'
import { useNavigate, useParams } from 'react-router-dom'
import '../me/index.css'
import './index.css'

function pickUserPayload(data: unknown): UserInfo | null {
  if (data == null || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  if (o.user_info && typeof o.user_info === 'object') {
    return o.user_info as UserInfo
  }
  if ('user_id' in o) return o as UserInfo
  return null
}

function UserPublicPage() {
  const { userId: userIdParam } = useParams()
  const navigate = useNavigate()
  const userId = userIdParam ? Number(userIdParam) : NaN
  const myId = getCurrentUserId()
  const isSelf = myId > 0 && myId === userId

  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')

  const roleTextMap: Record<string, string> = {
    superadmin: '超级管理员',
    classadmin: '班级管理员',
    student: '学生用户',
    staff: '教职工',
  }

  const displayName = useMemo(
    () => user?.name || (user?.email ? user.email.split('@')[0] : '用户'),
    [user],
  )
  const displayRole = user?.role ? roleTextMap[user.role] || user.role : ''

  useEffect(() => {
    if (!Number.isFinite(userId) || userId <= 0) {
      setLoading(false)
      setFeedback('无效的用户链接')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setFeedback('')
        const res = await getUserInfo({ user_id: userId })
        const raw = unwrapResponse<unknown>(res)
        const next = pickUserPayload(raw)
        if (!cancelled) {
          if (next) setUser(next)
          else setFeedback('未找到该用户')
        }
      } catch (e) {
        if (!cancelled) {
          setUser(null)
          setFeedback(getErrorMessage(e, '加载用户资料失败，请登录后再试'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [userId])

  return (
    <div className="page-shell me-page user-public-page">
      <button type="button" className="user-public-back" onClick={() => navigate(-1)}>
        <ArrowLeftOutlined />
        <span>返回</span>
      </button>

      <section className="surface-card me-profile-card">
        {loading ? (
          <div className="user-public-loading">
            <Spin />
          </div>
        ) : feedback && !user ? (
          <div className="user-public-error">{feedback}</div>
        ) : user ? (
          <>
            <div className="me-profile-header">
              <div className="me-profile-main">
                <div className="me-profile-avatar-frame">
                  <Avatar
                    size={92}
                    icon={<UserOutlined />}
                    src={user.avatar || undefined}
                    style={{
                      backgroundColor: '#64748b',
                      boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
                    }}
                  />
                </div>
                <div className="me-profile-copy">
                  <span className="soft-tag">创作者主页</span>
                  <div className="me-profile-name">{displayName}</div>
                  <div className="me-profile-desc">{user.email || '—'}</div>
                  <div className="me-profile-meta">
                    {displayRole ? <span>{displayRole}</span> : null}
                    <span>{user.department || '暂无部门'}</span>
                  </div>
                </div>
              </div>
              <div className="me-profile-actions">
                {isSelf ? (
                  <Button type="primary" onClick={() => navigate('/me')}>
                    编辑我的资料
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="me-profile-stats">
              <div className="me-profile-stat-card">
                <span className="me-profile-stat-card__label">用户 ID</span>
                <strong>{user.user_id}</strong>
              </div>
              <div className="me-profile-stat-card">
                <span className="me-profile-stat-card__label">班级 ID</span>
                <strong>{user.class_id ?? '-'}</strong>
              </div>
            </div>
            {feedback ? <div className="me-feedback">{feedback}</div> : null}
          </>
        ) : null}
      </section>
    </div>
  )
}

export default UserPublicPage
