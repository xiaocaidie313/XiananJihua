import { useNavigate } from 'react-router-dom';
import type { New } from '@/features/news/newsSlice';

function NewsCardOutline(props: { news: New }) {
  const { news } = props
  const { title, cover, id } = news
  const navigate = useNavigate()

  return (
    <article
      className="hover-rise"
      onClick={() => navigate(`/news/${id}`)}
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
          src={cover}
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
          {title}
        </div>
        <div style={{ fontSize: '14px', color: '#606060', lineHeight: 1.6 }}>
          小安资讯频道 · 点击查看详情与正文内容
        </div>
      </div>
    </article>
  )
}

export default NewsCardOutline