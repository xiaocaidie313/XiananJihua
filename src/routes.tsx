import { lazy, Suspense } from 'react'
import { Navigate, useRoutes, type RouteObject } from 'react-router-dom'
import { Spin } from 'antd'

const Home = lazy(() => import('./pages/home'))
const LoginPage = lazy(() => import('./pages/login'))
const Warn = lazy(() => import('./pages/warn'))
const Chat = lazy(() => import('./pages/chat'))
const ArticlePage = lazy(() => import('./pages/article'))
const News = lazy(() => import('./pages/news'))
const Me = lazy(() => import('./pages/me'))
const UserPublicPage = lazy(() => import('./pages/user'))
const ShortVideo = lazy(() => import('./pages/shortvedio'))
const UploadPage = lazy(() => import('./pages/upload'))
const Vedios = lazy(() => import('./pages/shortvedio/details'))
const VediosList = lazy(() => import('./pages/vedios'))
const Cartoon = lazy(() => import('./pages/cartoon'))
const Podcast = lazy(() => import('./pages/podcast'))

function RouteFallback() {
  return (
    <div
      className="app-route-fallback"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        width: '100%',
      }}
    >
      <Spin size="large" />
    </div>
  )
}

/**
 * 路由表：path + element，与 React Router 的 RouteObject 一致。
 * 配合 lazy 按路由拆包，首屏只拉当前页 chunk。
 */
const appRouteConfig: RouteObject[] = [
  { path: '/', element: <Navigate to="/home" replace /> },
  { path: '/home', element: <Home /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/warn', element: <Warn /> },
  { path: '/chat', element: <Chat /> },
  { path: '/article', element: <ArticlePage /> },
  { path: '/news/:id', element: <News /> },
  { path: '/me', element: <Me /> },
  { path: '/user/:userId', element: <UserPublicPage /> },
  { path: '/shortvideo', element: <ShortVideo /> },
  { path: '/upload', element: <UploadPage /> },
  { path: '/vedios', element: <VediosList /> },
  { path: '/vedios/:id', element: <Vedios /> },
  { path: '/cartoon', element: <Cartoon /> },
  { path: '/podcast', element: <Podcast /> },
  { path: '*', element: <Navigate to="/" replace /> },
]

export function AppRoutes() {
  const element = useRoutes(appRouteConfig)
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}
