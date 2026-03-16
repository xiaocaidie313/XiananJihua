import { useEffect, useMemo, useState } from 'react'
import { Carousel } from 'antd'
import { getNewArticles } from '@/api/content'
import NewsCardOutline, { type NewsCardItem } from '@/components/newcardoutLine'
import { getCarouselImages, setCurrentIndex } from '@/features/carousel/carousleSlice'
import { getSixNews } from '@/features/news/newsSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { ArticleSummary } from '@/constants/content'
import { getErrorMessage, unwrapResponse } from '@/utils/appState'

function ArticlePage() {
  const dispatch = useAppDispatch()
  const images = useAppSelector(getCarouselImages)
  const localNews = useAppSelector(getSixNews)
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dispatch(setCurrentIndex(0))
  }, [dispatch])

  useEffect(() => {
    let active = true

    const loadArticles = async () => {
      try {
        setLoading(true)
        const response = await getNewArticles({ page_size: 12, cursor: 0 })
        const data = unwrapResponse(response)
        if (active) {
          setArticles(data?.articles ?? [])
          setError('')
        }
      } catch (loadError) {
        console.log(loadError)
        if (active) {
          setError(getErrorMessage(loadError, '文章接口暂时不可用，当前已回退为原有新闻内容'))
        }
      } finally {
        if (active) {
          setLoading(false)
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
        meta: `${article.view_count || 0} 次阅读 · ${article.comment_count || 0} 条评论`,
      }))
    }

    return localNews.map((news) => ({
      id: news.id,
      title: news.title,
      cover: news.cover,
      author: news.author,
      description: '小安文章频道 · 点击查看详情与正文内容',
      meta: `${news.time.year}-${String(news.time.month).padStart(2, '0')}-${String(news.time.day).padStart(2, '0')}`,
    }))
  }, [articles, localNews])

  const featuredItems = articleItems.slice(0, 3)

  return (
    <div className="page-shell cartoon-page">
      <section className="page-hero">
        <span className="soft-tag">文章频道</span>

      </section>

      <div className="cartoon-layout">
        <section className="surface-card" style={{ padding: '24px' }}>
          <div className="section-head">
            <div>
              <div className="section-title">精选文章</div>
            </div>
          </div>

          <div className="cartoon-carousel">
            {!images || images.length === 0 ? (
              <div className="cartoon-carousel__placeholder">精选内容加载中...</div>
            ) : (
              <Carousel
                autoplay
                autoplaySpeed={3000}
                afterChange={(index) => dispatch(setCurrentIndex(index))}
                style={{ width: '100%', height: '100%' }}
              >
                {images.map((image) => (
                  <div key={image.id}>
                    <div className="cartoon-carousel__item">
                      <img src={image.url} alt={`carousel ${image.id}`} className="cartoon-carousel__image" />
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </section>

        <aside className="surface-card" style={{ padding: '22px' }}>
          <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
            阅读导览
          </div>
          <div className="info-stack">
            <div style={{ padding: '14px 16px', borderRadius: '18px', background: '#f8fafc' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>本次已接入的内容量</div>
              <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: 1.6, color: '#64748b' }}>
                {loading ? '正在拉取文章内容...' : `当前展示 ${articleItems.length} 条文章`}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="surface-card" style={{ padding: '24px' }}>
        <div className="section-head">
            <div>
                <div className="section-title">最新文章</div>
              </div>
          <span className="soft-tag">{articleItems.length} 篇</span>
        </div>

        {error && (
          <div style={{ marginBottom: '16px', fontSize: '13px', color: '#b45309' }}>
            {error}
          </div>
        )}

        <div className="feed-list">
          {articleItems.map((item) => (
            <NewsCardOutline key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="surface-card" style={{ padding: '24px' }}>
        <div className="section-head">
            <div>
                <div className="section-title">编辑精选</div>
              </div>
        </div>
        <div className="grid-auto-cards">
          {featuredItems.map((item) => (
            <div
              key={`featured-${item.id}`}
              className="section-card"
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', lineHeight: 1.5 }}>{item.title}</div>
              <div style={{ fontSize: '14px', lineHeight: 1.7, color: '#64748b' }}>
                {item.description || '点击进入查看正文内容与详情'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.meta}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ArticlePage
