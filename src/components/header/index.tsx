import { LeftOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import { SearchIcon } from '../icon'
import { useState, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './index.css'

interface HeaderProps {
  handleBack?: () => void
  canToggleSidebar?: boolean
  isSidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}

function Header({ handleBack, canToggleSidebar = true, isSidebarCollapsed = false, onToggleSidebar }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const topLevelPaths = new Set(['/home', '/shortvideo', '/vedios', '/article', '/cartoon', '/podcast', '/warn', '/chat', '/me', '/login'])
  const showBackButton = !topLevelPaths.has(location.pathname)
  const compactSearch = location.pathname.startsWith('/news/') || location.pathname.startsWith('/vedios/')

  const handleSearch = () => {
    if (searchValue.trim()) {
      console.log('搜索:', searchValue)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="header-left">
          <button
            className={`header-icon-button${canToggleSidebar && isSidebarCollapsed ? ' is-active' : ''}`}
            disabled={!canToggleSidebar}
            onClick={onToggleSidebar}
            style={!canToggleSidebar ? { opacity: 0.45, cursor: 'default' } : undefined}
            type="button"
          >
            <MenuOutlined />
          </button>
          {showBackButton && (
            <button
              className="header-back"
              onClick={() => {
                if (handleBack) {
                  handleBack()
                  return
                }

                navigate(-1)
              }}
              type="button"
            >
              <LeftOutlined />
            </button>
          )}
          <button className="header-brand" onClick={() => navigate('/home')} type="button">
            <img className="header-brand-logo" src="/xiaoan.svg" alt="小安" />
            <span className="header-brand-text">小安</span>
          </button>
        </div>

        <div className={`search-wrapper${compactSearch ? ' is-compact' : ''}`}>
          <div className="search-icon-wrapper">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="搜索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="search-input"
          />
          <button className="header-search-button" onClick={handleSearch} type="button">
            搜索
          </button>
        </div>

        <div className="header-actions">
          <button className="header-action subtle" onClick={() => navigate('/upload')} type="button">
            上传
          </button>
          <button className="header-icon-button" onClick={() => navigate('/me')} type="button">
            <UserOutlined />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header