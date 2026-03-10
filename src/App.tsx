import Footer from './components/footer'
import Header from './components/header'
import Sidebar from './components/sidebar'
import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Cartoon from './pages/cartoon'
import Chat from './pages/chat'
import Home from './pages/home'
import LoginPage from './pages/login'
import Me from './pages/me'
import ArticlePage from './pages/article'
import News from './pages/news'
import Podcast from './pages/podcast'
import ShortVideo from './pages/shortvedio'
import Vedios from './pages/shortvedio/details'
import Warn from './pages/warn'

function App() {
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const isChatPage = location.pathname.startsWith('/chat')
  const isLoginPage = location.pathname.startsWith('/login')
  const shouldShowFooter = !isChatPage && !isLoginPage
  const shouldShowSidebar = !isChatPage && !isLoginPage

  return (
    <div className="app-shell">
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className="app-content">
        <div className={`app-layout${shouldShowSidebar ? '' : ' no-sidebar'}${isSidebarCollapsed ? ' is-collapsed' : ''}`}>
          {shouldShowSidebar && <Sidebar collapsed={isSidebarCollapsed} />}
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/warn" element={<Warn />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/article" element={<ArticlePage />} />
              <Route path="/news/:id" element={<News />} />
              <Route path="/me" element={<Me />} />
              <Route path="/shortvideo" element={<ShortVideo />} />
              <Route path="/shortvideo/details/:id" element={<Vedios />} />
              <Route path="/cartoon" element={<Cartoon />} />
              <Route path="/podcast" element={<Podcast />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  )
}

export default App
