import { useEffect, useMemo, useState } from 'react'
import { Avatar, Form, Input, Modal, Spin, Upload } from 'antd'
import {
  BarChartOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MessageOutlined,
  ReloadOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { getUserInfo, updateUserInfo } from '@/api/auth'
import { uploadAvatar } from '@/utils/oss'
import type { UserInfo } from '@/constants/auth'
import { clearLoginInfo, getCurrentUserId, getErrorMessage, getStoredUser, setStoredUser, unwrapResponse } from '@/utils/appState'
import { useLocation, useNavigate } from 'react-router-dom'
import './index.css'

function Me() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<UserInfo | null>(getStoredUser())
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>('')
  const [form] = Form.useForm()

  const roleTextMap: Record<string, string> = {
    superadmin: '超级管理员',
    classadmin: '班级管理员',
    student: '学生用户',
    staff: '教职工',
  }

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : '未登录用户')
  const displayRole = user?.role ? roleTextMap[user.role] || user.role : '游客'
  const displayPhone = user?.phone || '未填写手机号'

  const loadUser = async () => {
    const cachedUser = getStoredUser()
    const userId = getCurrentUserId()

    if (!userId) {
      setUser(cachedUser)
      if (!cachedUser) {
        setFeedback('当前还没有登录，请先登录')
      }
      return
    }

    try {
      setLoading(true)
      const response = await getUserInfo({ user_id: userId })
      const data = unwrapResponse<UserInfo | { user: UserInfo } | null>(response)

      if (!data) {
        setUser(cachedUser)
        setFeedback(cachedUser ? '用户详情接口暂时为空，当前先展示本地登录信息' : '当前账号暂无可展示的用户资料')
        return
      }

      const nextUser = typeof data === 'object' && 'user' in data ? data.user : data
      setUser(nextUser)
      setStoredUser(nextUser)
      setFeedback('')
    } catch (error) {
      console.log(error)
      setUser(cachedUser)
      setFeedback(getErrorMessage(error, cachedUser ? '用户详情接口加载失败，当前先展示本地登录信息' : '用户信息加载失败，请稍后重试'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUser()
  }, [])

  useEffect(() => {
    const pageState = location.state as { justLoggedIn?: boolean } | null

    if (pageState?.justLoggedIn) {
      setFeedback('登录成功，当前已进入我的主页')
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, location.state, navigate])

  const openEditModal = () => {
    form.setFieldsValue({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      department: user?.department ?? '',
    })
    setEditAvatarUrl(user?.avatar ?? '')
    setAvatarError('')
    setEditModalOpen(true)
  }

  const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  const handleAvatarFileSelect = async (file: File) => {
    setAvatarError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError('请选择 JPG、PNG、GIF 或 WebP 格式的图片')
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError('图片大小不能超过 2MB')
      return
    }
    setAvatarUploading(true)
    try {
      const url = await uploadAvatar(file)
      setEditAvatarUrl(url)
    } catch (err) {
      setAvatarError(getErrorMessage(err, '头像上传失败，请重试'))
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleAvatarRemove = () => {
    setEditAvatarUrl(user?.avatar ?? '')
    setAvatarError('')
  }

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields()
      setEditLoading(true)
      const { name, phone, department } = values
      const params: Record<string, unknown> = { name, phone, department }
      if (editAvatarUrl) params.avatar = editAvatarUrl
      const response = await updateUserInfo(params)
      const data = unwrapResponse(response)
      const nextUser = data && typeof data === 'object' && 'user' in data
        ? (data as { user: UserInfo }).user
        : (data as UserInfo | null)
      if (nextUser) {
        setUser(nextUser)
        setStoredUser(nextUser)
      } else if (user) {
        const merged = { ...user, name, phone, department } as UserInfo
        if (editAvatarUrl) merged.avatar = editAvatarUrl
        setUser(merged)
        setStoredUser(merged)
      }
      setFeedback('资料已更新')
      setEditModalOpen(false)
    } catch (e) {
      console.log(e)
      setFeedback(getErrorMessage(e, '修改失败，请稍后重试'))
    } finally {
      setEditLoading(false)
    }
  }

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
    <div className="page-shell me-page">
      <section className="surface-card me-profile-card">
        <div className="me-profile-header">
          <div className="me-profile-main">
            <div className="me-profile-avatar-frame">
              <Avatar
                size={92}
                icon={<UserOutlined />}
                src={user?.avatar || undefined}
                style={{
                  backgroundColor: '#7c3aed',
                  boxShadow: '0 12px 28px rgba(124, 58, 237, 0.22)',
                }}
              />
            </div>
            <div className="me-profile-copy">
              <span className="soft-tag">{user ? '我的主页' : '游客状态'}</span>
              <div className="me-profile-name">{displayName}</div>
              <div className="me-profile-desc">
                {user?.email || '登录后可同步个人资料、对话记录和内容交互状态'}
              </div>
              <div className="me-profile-meta">
                <span>{displayRole}</span>
                <span>{loading ? '资料同步中' : user ? '已登录' : '未登录'}</span>
                <span>{user?.department || '暂无部门信息'}</span>
              </div>
            </div>
          </div>

          <div className="me-profile-actions">
            {user ? (
              <>
                <button className="header-action subtle" onClick={openEditModal} type="button">
                  <EditOutlined />
                  <span style={{ marginLeft: '6px' }}>修改资料</span>
                </button>
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
              </>
            ) : (
              <button className="header-action" onClick={() => navigate('/login')} type="button">
                去登录
              </button>
            )}
          </div>
        </div>

        <div className="me-profile-stats">
          <div className="me-profile-stat-card">
            <span className="me-profile-stat-card__label">账号状态</span>
            <strong>{loading ? '同步中' : user ? '正常使用中' : '等待登录'}</strong>
          </div>
          <div className="me-profile-stat-card">
            <span className="me-profile-stat-card__label">邀请码</span>
            <strong>{user?.invite_code_used || '-'}</strong>
          </div>
          <div className="me-profile-stat-card">
            <span className="me-profile-stat-card__label">班级 ID</span>
            <strong>{user?.class_id || '-'}</strong>
          </div>
        </div>

        {feedback && <div className="me-feedback">{feedback}</div>}
      </section>

      <Modal
        title="修改资料"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={() => void handleEditSubmit()}
        confirmLoading={editLoading}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item label="头像">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px',
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                background: '#fafafa',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                  size={80}
                  src={editAvatarUrl || user?.avatar}
                  icon={!editAvatarUrl && !user?.avatar ? <UserOutlined /> : undefined}
                  style={{ backgroundColor: '#e2e8f0' }}
                />
                {avatarUploading && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                    }}
                  >
                    <Spin size="small" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Upload
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleAvatarFileSelect(file)
                    return false
                  }}
                >
                  <span style={{ color: '#6366f1', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    点击选择图片
                  </span>
                </Upload>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#94a3b8' }}>
                  支持 JPG、PNG、GIF、WebP，不超过 2MB
                </div>
                {avatarError && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#ef4444' }}>{avatarError}</div>
                )}
                {(editAvatarUrl && editAvatarUrl !== user?.avatar) && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    style={{
                      marginTop: '8px',
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      color: '#94a3b8',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    恢复原头像
                  </button>
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item name="name" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="department" label="部门">
            <Input placeholder="请输入部门" />
          </Form.Item>
        </Form>
      </Modal>

      <div className="page-content-grid">
        <section className="surface-card me-menu-card">
          <div className="section-head">
            <div>
              <div className="section-title">常用入口</div>
            </div>
          </div>

          <div className="me-menu-list">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick}
                className="section-card hover-rise"
                style={{ width: '100%', padding: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
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

        <aside className="page-side-column me-side-column">
          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>账号概览</div>
            <div className="info-stack">
              <div className="info-row"><strong>身份</strong><span>{displayRole}</span></div>
              <div className="info-row"><strong>邮箱</strong><span>{user?.email || '未登录'}</span></div>
              <div className="info-row"><strong>状态</strong><span>{loading ? '同步中' : user ? '已登录' : '未登录'}</span></div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>资料信息</div>
            <div className="info-stack">
              <div className="info-row"><strong>部门</strong><span>{user?.department || '-'}</span></div>
              <div className="info-row"><strong>手机号</strong><span>{displayPhone}</span></div>
              <div className="info-row"><strong>用户 ID</strong><span>{user?.user_id || '-'}</span></div>
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
