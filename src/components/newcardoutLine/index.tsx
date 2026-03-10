import { useNavigate } from 'react-router-dom'

export interface NewsCardItem {
  id: number
  title: string
  cover: string
  description?: string
  author?: string
  meta?: string
}

function NewsCardOutline({ item }: { item: NewsCardItem }) {
  const navigate = useNavigate()

  return (
    <article
      className="hover-rise"
      onClick={() => navigate(`/news/${item.id}`)}
      style={{
        cursor: 'pointer',
        width: '100%',
        minHeight: '118px',
        display: 'grid',
        gridTemplateColumns: '220px minmax(0, 1fr)',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '118px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#f8fafc',
        }}
      >
        <img
          src={item.cover}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px', minWidth: 0 }}>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1.5,
            color: '#0f0f0f',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {item.author && (
            <div style={{ fontSize: '13px', color: '#606060', fontWeight: 500 }}>
              {item.author}
            </div>
          )}
          <div style={{ fontSize: '14px', color: '#606060', lineHeight: 1.6 }}>
            {item.description || '小安文章频道 · 点击查看详情与正文内容'}
          </div>
          {item.meta && (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {item.meta}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default NewsCardOutline