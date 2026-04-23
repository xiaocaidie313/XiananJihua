import Header from './components/header'
import Sidebar from './components/sidebar'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppRoutes } from './routes'

function App() {
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const isLoginPage = location.pathname.startsWith('/login')
  const isChatPage = location.pathname.startsWith('/chat')

  // const shouldShowFooter = !location.pathname.startsWith('/chat') && !isLoginPage
  const shouldShowSidebar = !isLoginPage
  const canToggleSidebar = shouldShowSidebar

  return (
    <div className={`app-shell${isLoginPage ? ' app-shell--login' : ''}`}>
      <Header
        canToggleSidebar={canToggleSidebar}
        isSidebarCollapsed={canToggleSidebar ? isSidebarCollapsed : false}
        onToggleSidebar={canToggleSidebar ? () => setIsSidebarCollapsed((prev) => !prev) : undefined}
      />
      <div className="app-content">
        <div className={`app-layout${shouldShowSidebar ? '' : ' no-sidebar'}${shouldShowSidebar && isSidebarCollapsed ? ' is-collapsed' : ''}`}>
          {shouldShowSidebar && <Sidebar collapsed={isSidebarCollapsed} />}
          <main
            className={`app-main${isLoginPage ? ' app-main--login' : ''}${isChatPage ? ' app-main--chat' : ''}`}
            style={{ position: 'relative' }}
          >
            <AppRoutes />
          </main>
        </div>
      </div>
      {/* {shouldShowFooter && <Footer />} */}
    </div>
  )
}

export default App
