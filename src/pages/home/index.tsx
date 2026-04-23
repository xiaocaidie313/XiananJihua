import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carousel } from 'antd'
import { getNewArticles } from '@/api/content'
import Nav from '../../components/nav'
import NewsCardOutline, { type NewsCardItem } from '../../components/newcardoutLine'
import { useAppSelector } from '@/store/hooks'
import { getCarouselImages } from '@/features/carousel/carousleSlice'
import { useVideos } from '@/hooks/useVideos'
import type { ArticleSummary } from '@/constants/content'
import { getErrorMessage, unwrapResponse } from '@/utils/appState'
import { ARTICLE_CARD_COVER_PLACEHOLDER } from '@/constants/placeholders'
import { readHomeArticlesCache, writeHomeArticlesCache } from '@/utils/homeFeedCache'
import VedioCardOutline from '@/components/vediocardoutline'
import {
  ArticleFeedSkeleton,
  SidebarPickSkeleton,
  SidebarVideoSkeleton,
  VideoGridSkeleton,
} from '@/pages/home/HomeSkeletons'

/** 视频列表 + 文章列表均就绪后，再延迟一小段时间一齐露出（避免骨架屏一闪而过） */
const HOME_FEED_REVEAL_DELAY_MS = 480

function Home() {
  const navigate = useNavigate()
  const images = useAppSelector(getCarouselImages)
  const { vedios, initialPending: videosPending } = useVideos()
  const filters = ['全部', '推荐', '安全科普', '校园话题', '成长陪伴', '心理健康']

  /** 首页首次文章请求结束前为 true——与缓存无关，避免先缓存再接口替换的突变 */
  const [articlesPending, setArticlesPending] = useState(true)
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [articleError, setArticleError] = useState('')

  useEffect(() => {
    let active = true

    const loadArticles = async () => {
      try {
        const response = await getNewArticles({ page_size: 6, cursor: 0 })
        const data = unwrapResponse(response)
        const next = data?.articles ?? []
        if (active) {
          setArticles(next)
          writeHomeArticlesCache(next)
          setArticleError('')
        }
      } catch (error) {
        console.log(error)
        if (active) {
          setArticleError(getErrorMessage(error, '文章列表加载失败'))
          const cached = readHomeArticlesCache()
          if (cached.length > 0) {
            setArticles(cached)
          }
        }
      } finally {
        if (active) setArticlesPending(false)
      }
    }

    void loadArticles()

    return () => {
      active = false
    }
  }, [])

  const articleItems = useMemo<NewsCardItem[]>(() => {
    if (articles.length === 0) return []
    return articles.map((article) => ({
      id: article.article_id,
      title: article.name,
      cover: article.cover?.trim() || ARTICLE_CARD_COVER_PLACEHOLDER,
      author: article.author,
      description: article.description || '小安文章频道 · 点击查看详情与正文内容',
      meta: `${Math.max(article.view_count || 0, 0)} 次阅读`,
    }))
  }, [articles])

  const recommendNews = articleItems.slice(0, 3)

  const feedDataReady = !videosPending && !articlesPending
  const [feedRevealed, setFeedRevealed] = useState(false)

  useEffect(() => {
    if (!feedDataReady) {
      setFeedRevealed(false)
      return
    }
    const t = window.setTimeout(() => setFeedRevealed(true), HOME_FEED_REVEAL_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [feedDataReady])

  const showFeedContent = feedRevealed

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
              </div>
            </div>
            <Nav />
          </div>

          <section className="surface-card" style={{ padding: '20px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">推荐视频</div>
              </div>
            </div>
            <div className="yt-video-grid">
              {!showFeedContent ? (
                <VideoGridSkeleton count={8} />
              ) : (
                vedios.slice(0, 8).map((vedio, index) => (
                  <VedioCardOutline vedio={vedio} key={vedio.video_id ?? index} />
                ))
              )}
            </div>
          </section>

          <section className="surface-card" style={{ padding: '20px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">最新文章</div>
              </div>
            </div>
            {articleError && (
              <div style={{ marginBottom: '16px', fontSize: '13px', color: '#b45309' }}>
                {articleError}
              </div>
            )}
            <div className="feed-list">
              {!showFeedContent ? (
                <ArticleFeedSkeleton count={6} />
              ) : articleItems.length > 0 ? (
                articleItems.map((item) => <NewsCardOutline item={item} key={item.id} />)
              ) : (
                <div style={{ padding: '28px 8px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>暂无文章</div>
              )}
            </div>
          </section>
        </div>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: '20px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>继续观看</div>
            <div className="info-stack">
              {!showFeedContent ? (
                <SidebarVideoSkeleton count={3} />
              ) : (
                <Fragment>
                  {vedios.slice(0, 3).map((item, i) => (
                    <div
                      key={item.video_id ?? i}
                      role="button"
                      tabIndex={0}
                      onClick={() => item.video_id != null && navigate(`/vedios/${item.video_id}`)}
                      onKeyDown={(e) => e.key === 'Enter' && item.video_id != null && navigate(`/vedios/${item.video_id}`)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px minmax(0, 1fr)',
                        gap: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={item.cover} alt={item.name ?? ''} style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '10px' }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.45, color: '#0f0f0f' }}>{item.name ?? ''}</div>
                        <div style={{ marginTop: '6px', fontSize: '12px', color: '#606060' }}>{item.author ?? ''}</div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              )}
            </div>
          </div>

          <div className="surface-card" style={{ padding: '20px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>编辑精选</div>
            <div className="info-stack">
              {!showFeedContent ? (
                <SidebarPickSkeleton count={3} />
              ) : recommendNews.length > 0 ? (
                recommendNews.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/news/${item.id}`)}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/news/${item.id}`)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: '#f8f8f8',
                      border: '1px solid #ececec',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.6, color: '#0f0f0f' }}>{item.title}</div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#606060' }}>热点推荐</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px 8px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>暂无精选</div>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Home