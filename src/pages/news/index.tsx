import { useAppSelector } from '@/store/hooks';
import { getNewsById } from '@/features/news/newsSlice';
import { useParams } from 'react-router-dom';
import { Avatar } from 'antd';
import { CommentOutlined, LikeOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons';

function News() {
  const { id } = useParams();
  const news = useAppSelector(state => getNewsById(state, Number(id)));

  if (!news) return <div>内容加载中...</div>;

  const { title, author, time, province, content } = news;
  return (
    <div className="page-shell">
      <section className="page-hero">
        <span className="soft-tag">资讯详情</span>
        <h1 className="page-title" style={{ marginTop: '16px' }}>
          {title}
        </h1>
        <p className="page-subtitle">
          {author} · {time.year}年{time.month}月{time.day}日 {time.hour}:{time.minute} · {province}
        </p>
      </section>

      <div className="page-content-grid">
        <article className="surface-card" style={{ padding: '32px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <Avatar size={56} icon={<UserOutlined />} style={{ backgroundColor: '#8b5cf6' }} />
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>{author}</div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>青少年安全与陪伴专栏</div>
            </div>
          </div>

          <div
            style={{
              fontSize: '17px',
              lineHeight: 2,
              color: '#334155',
              textAlign: 'justify',
              maxWidth: '780px',
            }}
          >
            <p>{content}</p>
          </div>
        </article>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
              文章操作
            </div>
            <div className="info-stack">
              <div className="info-row"><strong><LikeOutlined /> 点赞</strong><span>456</span></div>
              <div className="info-row"><strong><CommentOutlined /> 评论</strong><span>789</span></div>
              <div className="info-row"><strong><ShareAltOutlined /> 分享</strong><span>123</span></div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
              阅读提示
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#64748b' }}>
              详情页不再用移动端底部操作栏，而是采用网页侧边信息区，提升桌面端阅读专注度。
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
export default News