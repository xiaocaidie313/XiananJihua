import { useEffect, useMemo, useState } from 'react'
import { Carousel } from 'antd'
import { getNewArticles } from '@/api/content'
import Nav from '../../components/nav'
import NewsCardOutline, { type NewsCardItem } from '../../components/newcardoutLine'
import { getSixNews } from '@/features/news/newsSlice'
import { useAppSelector } from '@/store/hooks'
import { getCarouselImages } from '@/features/carousel/carousleSlice'
import { getAllVedios } from '@/features/vedios/vediosSlice'
import type { ArticleSummary } from '@/constants/content'
import { getErrorMessage, unwrapResponse } from '@/utils/appState'
import VedioCardOutline from '@/components/vediocardoutline'

function Home() {
  const sixNews = useAppSelector(getSixNews)
  const images = useAppSelector(getCarouselImages)
  const vedios = useAppSelector(getAllVedios)
  const filters = ['全部', '推荐', '安全科普', '校园话题', '成长陪伴', '心理健康']
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [articleError, setArticleError] = useState('')

  useEffect(() => {
    let active = true

    const loadArticles = async () => {
      try {
        const response = await getNewArticles({ page_size: 6, cursor: 0 })
        const data = unwrapResponse(response)
        if (active) {
          setArticles(data.articles || [])
          setArticleError('')
        }
      } catch (error) {
        if (active) {
          setArticleError(getErrorMessage(error, '文章接口加载失败，已展示本地内容'))
        }
      }
    }

    void loadArticles()

    return () => {
      active = false
    }
  }, [])

  const articleItems = useMemo<NewsCardItem[]>(() => {
    if (articles.length) {
      return articles.map((article) => ({
        id: article.article_id,
        title: article.name,
        cover: article.cover,
        author: article.author,
        description: article.description || '小安文章频道 · 点击查看详情与正文内容',
        meta: `${Math.max(article.view_count || 0, 0)} 次阅读`,
      }))
    }

    return sixNews.map((news) => ({
      id: news.id,
      title: news.title,
      cover: news.cover,
      author: news.author,
      description: '小安文章频道 · 点击查看详情与正文内容',
      meta: `${news.time.year}-${String(news.time.month).padStart(2, '0')}-${String(news.time.day).padStart(2, '0')}`,
    }))
  }, [articles, sixNews])

  const recommendNews = articleItems.slice(0, 3)

  return (
    <div className="page-shell">
      <div className="yt-filter-row">
        {filters.map((item, index) => (
          <button key={item} className={`yt-filter-chip${index === 0 ? ' is-active' : ''}`} type="button">
            {item}
          </button>
        ))}
      </div>

      <section className="page-content-grid">
        <div className="page-main-column">
          <div className="surface-card" style={{ padding: '18px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">本周精选</div>
                <div className="section-meta">像 YouTube 首页一样先展示重点内容横幅</div>
              </div>
              <span className="soft-tag">Featured</span>
            </div>
            <div
              style={{
                height: '360px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {!images || images.length === 0 ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                  }}
                >
                  轮播图数据加载中...
                </div>
              ) : (
                <Carousel autoplay autoplaySpeed={3200} draggable infinite={images.length > 1} style={{ width: '100%', height: '360px' }}>
                  {images.map((image) => (
                    <div key={image.id}>
                      <div
                        style={{
                          height: '360px',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#ffffff',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={image.url}
                          alt={`carousel ${image.id}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
          </div>

          <div className="surface-card" style={{ padding: '20px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">频道导航</div>
                <div className="section-meta">保留频道入口，但弱化为首页中的一个模块</div>
              </div>
            </div>
            <Nav />
          </div>

          <section className="surface-card" style={{ padding: '20px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">推荐视频</div>
                <div className="section-meta">核心内容区采用更接近 YouTube 首页的视频流</div>
              </div>
            </div>
            <div className="yt-video-grid">
              {vedios.map((vedio) => (
                <VedioCardOutline vedio={vedio} key={vedio.id} />
              ))}
            </div>
          </section>

          <section className="surface-card" style={{ padding: '20px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">最新文章</div>
                <div className="section-meta">首页优先读取真实文章接口，失败时回退到原有新闻内容</div>
              </div>
            </div>
            {articleError && (
              <div style={{ marginBottom: '16px', fontSize: '13px', color: '#b45309' }}>
                {articleError}
              </div>
            )}
            <div className="feed-list">
              {articleItems.map((item) => (
                <NewsCardOutline item={item} key={item.id} />
              ))}
            </div>
          </section>
        </div>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: '20px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>继续观看</div>
            <div className="info-stack">
              {vedios.slice(0, 3).map((item) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: '10px' }}>
                  <img src={item.cover} alt={item.title} style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '10px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.45, color: '#0f0f0f' }}>{item.title}</div>
                    <div style={{ marginTop: '6px', fontSize: '12px', color: '#606060' }}>{item.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card" style={{ padding: '20px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>编辑精选</div>
            <div className="info-stack">
              {recommendNews.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: '#f8f8f8',
                    border: '1px solid #ececec',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.6, color: '#0f0f0f' }}>{item.title}</div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#606060' }}>热点推荐</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Home