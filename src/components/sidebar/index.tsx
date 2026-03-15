import type { ReactNode } from 'react'
import {
  AlertOutlined,
  CompassOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
  MessageOutlined,
  PlaySquareOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
  collapsed?: boolean
}

function Sidebar({ collapsed = false }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const primaryItems = [
    { label: '首页', path: '/home', icon: <HomeOutlined /> },
    { label: '短视频', path: '/shortvideo', icon: <PlaySquareOutlined /> },
    { label: '长视频', path: '/vedios', icon: <PlaySquareOutlined /> },
    { label: '文章', path: '/article', icon: <ReadOutlined /> },
    { label: '条漫', path: '/cartoon', icon: <CompassOutlined /> },
    { label: '播客', path: '/podcast', icon: <CustomerServiceOutlined /> },
  ]

  const utilityItems = [
    { label: 'AI 对话', path: '/chat', icon: <MessageOutlined /> },
    { label: '紧急求助', path: '/warn', icon: <AlertOutlined /> },
    { label: '我的', path: '/me', icon: <UserOutlined /> },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const renderButton = (label: string, path: string, icon: ReactNode) => (
    <button
      key={path}
      className={`yt-sidebar-item${isActive(path) ? ' is-active' : ''}${collapsed ? ' is-collapsed' : ''}`}
      onClick={() => navigate(path)}
      title={collapsed ? label : undefined}
      type="button"
    >
      <span className="yt-sidebar-item__icon">{icon}</span>
      {!collapsed && <span className="yt-sidebar-item__label">{label}</span>}
    </button>
  )

  return (
    <aside className={`yt-sidebar${collapsed ? ' is-collapsed' : ''}`}>
      <div className="yt-sidebar-section">
        {primaryItems.map((item) => renderButton(item.label, item.path, item.icon))}
      </div>

      <div className="yt-sidebar-divider" />

      <div className="yt-sidebar-section">
        {!collapsed && <div className="yt-sidebar-title">更多功能</div>}
        {utilityItems.map((item) => renderButton(item.label, item.path, item.icon))}
      </div>
    </aside>
  )
}

export default Sidebar
