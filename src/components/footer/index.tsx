import { GithubOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './index.css'

function Footer() {
  const navigate = useNavigate()
  const links = [
    { label: '首页', path: '/home' },
    { label: '短视频', path: '/shortvideo' },
    { label: '文章', path: '/article' },
    { label: '条漫', path: '/cartoon' },
    { label: '播客', path: '/podcast' },
    { label: 'AI 对话', path: '/chat' },
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__logo">XA</div>
          <div>
            <div className="site-footer__title">小安计划 Web</div>
            <div className="site-footer__desc">青少年安全与陪伴内容平台</div>
          </div>
        </div>

        <div className="site-footer__links">
          {links.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} type="button">
              {item.label}
            </button>
          ))}
        </div>

        <div className="site-footer__meta">
          <span>
            <SafetyCertificateOutlined />
            安全内容陪伴
          </span>
          <span>
            <GithubOutlined />
            Web 化布局升级
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
