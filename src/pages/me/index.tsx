import { useEffect, useMemo, useState } from 'react'
import { Avatar } from 'antd'
import {
  BarChartOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MessageOutlined,
  ReloadOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { getUserInfo } from '@/api/auth'
import type { UserInfo } from '@/constants/auth'
import { clearLoginInfo, getCurrentUserId, getErrorMessage, getStoredUser, unwrapResponse } from '@/utils/appState'
import { useNavigate } from 'react-router-dom'

function Me() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | null>(getStoredUser())
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const loadUser = async () => {
    const userId = getCurrentUserId()

    if (!userId) {
      setUser(null)
      return
    }

    try {
      setLoading(true)
      const response = await getUserInfo({ user_id: userId })
      const data = unwrapResponse<any>(response)
      const nextUser = data.user || data
      setUser(nextUser)
      localStorage.setItem('user', JSON.stringify(nextUser))
      setFeedback('')
    } catch (error) {
      setFeedback(getErrorMessage(error, '用户信息加载失败，请稍后重试'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUser()
  }, [])

  const menuItems = useMemo(() => {
    return [
      {
        title: '个人数据看板',
        icon: <BarChartOutlined style={{ fontSize: '20px' }} />,
        onClick: () => setFeedback('数据看板页面待补充，这里已接入真实用户信息'),
      },
      {
        title: 'AI 对话入口',
        icon: <MessageOutlined style={{ fontSize: '20px' }} />,
        onClick: () => navigate('/chat'),
      },
      {
        title: '关于小安',
        icon: <InfoCircleOutlined style={{ fontSize: '20px' }} />,
        onClick: () => setFeedback('小安计划致力于提供青少年心理陪伴与安全支持'),
      },
    ]
  }, [navigate])

  return (
    <div className="page-shell">
      <section className="page-hero">
        <span className="soft-tag">个人中心</span>
        <h1 className="page-title" style={{ marginTop: '16px' }}>
          账号状态和用户资料已经接入真实认证链路
        </h1>
        <p className="page-subtitle">
          这里会优先读取本地登录态，再通过用户信息接口刷新最新资料；未登录时可直接跳转到认证页。
        </p>
      </section>

      <div className="page-content-grid">
        <section className="surface-card" style={{ padding: '28px' }}>
          <div
            className="lightpurple"
            style={{
              width: '100%',
              padding: '30px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '24px',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Avatar
                size={76}
                icon={<UserOutlined />}
                src={user?.avatar || undefined}
                style={{
                  backgroundColor: '#891DB4',
                  border: '4px solid white',
                  boxShadow: '0 8px 24px rgba(137, 29, 180, 0.18)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                  {user?.name || '未登录用户'}
                </span>
                <span style={{ fontSize: '14px', color: '#5b6475' }}>
                  {user?.email || '登录后可查看个人资料与最近活动记录'}
                </span>
              </div>
            </div>

            {user ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="header-action subtle" onClick={() => void loadUser()} type="button">
                  <ReloadOutlined />
                  <span style={{ marginLeft: '6px' }}>刷新资料</span>
                </button>
                <button
                  className="header-action subtle"
                  onClick={() => {
                    clearLoginInfo()
                    setUser(null)
                    navigate('/login')
                  }}
                  type="button"
                >
                  <LogoutOutlined />
                  <span style={{ marginLeft: '6px' }}>退出登录</span>
                </button>
              </div>
            ) : (
              <button className="header-action" onClick={() => navigate('/login')} type="button">
                去登录
              </button>
            )}
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

          <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick}
                className="section-card hover-rise"
                style={{
                  width: '100%',
                  padding: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: '#f3f0ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#891DB4',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{item.title}</span>
                </div>
                <RightOutlined style={{ fontSize: '16px', color: '#94a3b8' }} />
              </div>
            ))}
          </div>
        </section>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>账号概览</div>
            <div className="info-stack">
              <div className="info-row"><strong>身份</strong><span>{user?.role || '游客'}</span></div>
              <div className="info-row"><strong>邮箱</strong><span>{user?.email || '未登录'}</span></div>
              <div className="info-row"><strong>状态</strong><span>{loading ? '同步中' : user ? '已登录' : '未登录'}</span></div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>资料信息</div>
            <div className="info-stack">
              <div className="info-row"><strong>部门</strong><span>{user?.department || '-'}</span></div>
              <div className="info-row"><strong>班级 ID</strong><span>{user?.class_id || '-'}</span></div>
              <div className="info-row"><strong>邀请码</strong><span>{user?.invite_code_used || '-'}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Me
