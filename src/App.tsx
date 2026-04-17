import Header from './components/header'
import Sidebar from './components/sidebar'
import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Cartoon from './pages/cartoon'
import Chat from './pages/chat'
import Home from './pages/home'
import LoginPage from './pages/login'
import Me from './pages/me'
import UserPublicPage from './pages/user'
import ArticlePage from './pages/article'
import News from './pages/news'
import Podcast from './pages/podcast'
import ShortVideo from './pages/shortvedio'
import Vedios from './pages/shortvedio/details'
import VediosList from './pages/vedios'
import UploadPage from './pages/upload'
import Warn from './pages/warn'

const PAGE_TRANSITION_DELAY = 500

function App() {
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const isFirstMount = useRef(true)
  const isLoginPage = location.pathname.startsWith('/login')
  const isChatPage = location.pathname.startsWith('/chat')

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    const hideTimer = setTimeout(() => setShowContent(false), 0)
    const showTimer = setTimeout(() => setShowContent(true), PAGE_TRANSITION_DELAY)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(showTimer)
    }
  }, [location.pathname])
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
            {!showContent && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#ffffff',
                  zIndex: 10,
                }}
              />
            )}
            <Routes> 
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/warn" element={<Warn />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/article" element={<ArticlePage />} />
              <Route path="/news/:id" element={<News />} />
              <Route path="/me" element={<Me />} />
              <Route path="/user/:userId" element={<UserPublicPage />} />
              <Route path="/shortvideo" element={<ShortVideo />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/vedios/:id" element={<Vedios />} />
              <Route path="/vedios" element={<VediosList />} />
              <Route path="/cartoon" element={<Cartoon />} />
              <Route path="/podcast" element={<Podcast />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
      {/* {shouldShowFooter && <Footer />} */}
    </div>
  )
}

export default App
