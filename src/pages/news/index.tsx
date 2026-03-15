import { useCallback, useEffect, useMemo, useState } from 'react'
import { Avatar } from 'antd'
import { CommentOutlined, LikeOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons'
import { collectContent, getArticleInfo, likeContent, uncollectContent, unlikeContent } from '@/api/content'
import { getNewsById } from '@/features/news/newsSlice'
import { useAppSelector } from '@/store/hooks'
import type { ArticleInfo } from '@/constants/content'
import { ContentTypeId } from '@/constants/content'
import { getCurrentUserId, getErrorMessage, unwrapResponse } from '@/utils/appState'
import { useParams } from 'react-router-dom'

function News() {
  const { id } = useParams()
  const articleId = Number(id)
  const fallbackNews = useAppSelector((state) => getNewsById(state, articleId))
  const [article, setArticle] = useState<ArticleInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionFeedback, setActionFeedback] = useState('')
  const [likeCount, setLikeCount] = useState<number | null>(null)
  const [collectCount, setCollectCount] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isCollected, setIsCollected] = useState(false)

  useEffect(() => {
    let active = true

    const loadArticle = async () => {
      try {
        setLoading(true)
        const response = await getArticleInfo(articleId)
        const data = unwrapResponse(response)
        if (active) {
          setArticle(data?.article ?? null)
          setError('')
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, '文章详情接口加载失败，已回退为原有新闻内容'))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (articleId) {
      void loadArticle()
    } else {
      setLoading(false)
    }

    return () => {
      active = false
    }
  }, [articleId])

  useEffect(() => {
    if (article) {
      setLikeCount(article.like_count)
      setCollectCount(article.collect_count)
      setIsLiked(Boolean(article.is_liked))
      setIsCollected(Boolean(article.is_collected))
    } else if (fallbackNews) {
      setLikeCount(456)
      setCollectCount(123)
      setIsLiked(false)
      setIsCollected(false)
    }
  }, [article, fallbackNews])

  const contentId = article?.article_id ?? articleId
  const userId = getCurrentUserId()

  const handleLike = useCallback(async () => {
    if (!userId) {
      setActionFeedback('请先登录后再点赞')
      return
    }
    try {
      if (isLiked) {
        await unlikeContent({ content_id: contentId, content_type: ContentTypeId.article_id })
        setLikeCount((c) => (c ?? 0) - 1)
        setIsLiked(false)
      } else {
        await likeContent({ content_id: contentId, content_type: ContentTypeId.article_id })
        setLikeCount((c) => (c ?? 0) + 1)
        setIsLiked(true)
      }
      setActionFeedback('')
    } catch (e) {
      setActionFeedback(getErrorMessage(e, '操作失败，请稍后重试'))
    }
  }, [contentId, isLiked, userId])

  const handleCollect = useCallback(async () => {
    if (!userId) {
      setActionFeedback('请先登录后再收藏')
      return
    }
    try {
      if (isCollected) {
        await uncollectContent({ content_id: contentId, content_type: ContentTypeId.article_id })
        setCollectCount((c) => (c ?? 0) - 1)
        setIsCollected(false)
      } else {
        await collectContent({ content_id: contentId, content_type: ContentTypeId.article_id })
        setCollectCount((c) => (c ?? 0) + 1)
        setIsCollected(true)
      }
      setActionFeedback('')
    } catch (e) {
      setActionFeedback(getErrorMessage(e, '操作失败，请稍后重试'))
    }
  }, [contentId, isCollected, userId])

  const handleComment = useCallback(() => {
    setActionFeedback('评论功能开发中，敬请期待')
  }, [])

  const contentState = useMemo(() => {
    if (article) {
      const publishedAt = article.published_at ? new Date(article.published_at) : null
      return {
        title: article.name,
        author: article.author,
        content: article.content || article.description,
        subtitle: publishedAt
          ? `${article.author} · ${publishedAt.toLocaleString('zh-CN')} · ${article.view_count} 次阅读`
          : `${article.author} · 文章频道`,
        likeCount: likeCount ?? article.like_count,
        commentCount: article.comment_count,
        shareCount: collectCount ?? article.collect_count,
      }
    }

    if (fallbackNews) {
      return {
        title: fallbackNews.title,
        author: fallbackNews.author,
        content: fallbackNews.content,
        subtitle: `${fallbackNews.author} · ${fallbackNews.time.year}年${fallbackNews.time.month}月${fallbackNews.time.day}日 ${fallbackNews.time.hour}:${fallbackNews.time.minute} · ${fallbackNews.province}`,
        likeCount: likeCount ?? 456,
        commentCount: 789,
        shareCount: collectCount ?? 123,
      }
    }

    return null
  }, [article, fallbackNews, likeCount, collectCount])

  if (loading && !contentState) {
    return <div className="page-shell">内容加载中...</div>
  }

  if (!contentState) {
    return <div className="page-shell">未找到对应文章内容</div>
  }

  return (
    <div className="page-shell">
      <section className="page-hero">
        <span className="soft-tag">文章详情</span>
        <h1 className="page-title" style={{ marginTop: '16px' }}>
          {contentState.title}
        </h1>
        <p className="page-subtitle">{contentState.subtitle}</p>
      </section>

      <div className="page-content-grid">
        <article className="surface-card" style={{ padding: '32px', minWidth: 0 }}>
          {error && (
            <div style={{ marginBottom: '20px', fontSize: '13px', color: '#b45309' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <Avatar size={56} icon={<UserOutlined />} style={{ backgroundColor: '#8b5cf6' }} />
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>{contentState.author}</div>
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
              whiteSpace: 'pre-wrap',
            }}
          >
            <p>{contentState.content}</p>
          </div>
        </article>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
              文章操作
            </div>
            {actionFeedback && (
              <div style={{ marginBottom: '12px', fontSize: '13px', color: '#b45309' }}>{actionFeedback}</div>
            )}
            <div className="info-stack">
              <button
                type="button"
                onClick={() => void handleLike()}
                className="info-row"
                style={{
                  width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  padding: '10px 0', borderRadius: '8px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <strong><LikeOutlined style={{ color: isLiked ? '#ff2c55' : undefined }} /> 点赞</strong>
                <span>{contentState.likeCount}</span>
              </button>
              <button
                type="button"
                onClick={handleComment}
                className="info-row"
                style={{
                  width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  padding: '10px 0', borderRadius: '8px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <strong><CommentOutlined /> 评论</strong>
                <span>{contentState.commentCount}</span>
              </button>
              <button
                type="button"
                onClick={() => void handleCollect()}
                className="info-row"
                style={{
                  width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  padding: '10px 0', borderRadius: '8px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <strong><ShareAltOutlined style={{ color: isCollected ? '#7c3aed' : undefined }} /> 收藏</strong>
                <span>{contentState.shareCount}</span>
              </button>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '22px' }}>
            <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
              阅读提示
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#64748b' }}>
              点击文章卡片可进入详情页阅读。
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default News