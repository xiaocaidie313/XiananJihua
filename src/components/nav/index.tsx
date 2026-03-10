import { ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { CartoonIcon, PodcastIcon, ShortVideoIcon } from '../icon'

function Nav() {
  const navigate = useNavigate()
  const pages = [
    {
      name: '短视频',
      description: '接近 YouTube 的视频内容流和播放页',
      path: '/shortvideo',
      icon: <ShortVideoIcon />,
    },
    {
      name: '条漫',
      description: '更适合网页浏览的图文内容与推荐瀑布流',
      path: '/cartoon',
      icon: <CartoonIcon />,
    },
    {
      name: '播客',
      description: '采用专辑卡片与节目列表并排展示',
      path: '/podcast',
      icon: <PodcastIcon />,
    },
  ]

  return (
    <div className="grid-auto-cards">
      {pages.map((item) => (
        <button
          key={item.path}
          className="section-card hover-rise"
          onClick={() => navigate(item.path)}
          style={{
            padding: '22px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
          type="button"
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '18px',
              background: '#f5f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#64748b' }}>{item.description}</div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#5b4bdb',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              进入频道
              <ArrowRightOutlined />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default Nav