import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar } from 'antd'
import { CommentOutlined, HeartFilled, HeartOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons'
import { collectContent, getArticleInfo, likeContent, uncollectContent, unlikeContent, getRootComment, addComment } from '@/api/content'
import { getNewsById } from '@/features/news/newsSlice'
import { useAppSelector } from '@/store/hooks'
import type { ArticleInfo, ResponseComment, RootComment, RootComments } from '@/constants/content'
import { ContentType } from '@/pages/shortvedio'
import { USER_UPDATED_EVENT, getCurrentUserId, getErrorMessage, getStoredUser, timestampToMs, unwrapResponse } from '@/utils/appState'
import { useNavigate, useParams } from 'react-router-dom'
import { getArticleCreatorUserId } from '@/utils/contentUser'

/** 独立成行的图片 URL 正则 */
const IMAGE_LINE_REGEX = /^https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i
const DEFAULT_AVATAR = 'https://xiaoanv.oss-cn-beijing.aliyuncs.com/pics/avt.png'

function renderArticleContent(content: string) {
  if (!content) return null
  const lines = content.split('\n')
  return lines.map((line, i) => {
    const trimmed = line.trim()
    if (IMAGE_LINE_REGEX.test(trimmed)) {
      return (
        <img
          key={i}
          src={trimmed}
          alt=""
          style={{
            maxWidth: '100%',
            height: 'auto',
            margin: '16px 0',
            borderRadius: '8px',
            display: 'block',
          }}
        />
      )
    }
    return (
      <Fragment key={i}>
        {line}
        {i < lines.length - 1 ? <br /> : null}
      </Fragment>
    )
  })
}

function News() {
  const navigate = useNavigate()
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
  const [comments, setComments] = useState<RootComment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [publishLoading, setPublishLoading] = useState(false)
  const commentSectionRef = useRef<HTMLDivElement>(null)
  const [currentUser, setCurrentUser] = useState(getStoredUser())

  const formatCommentTime = (ts: number) => {
    const ms = timestampToMs(ts)
    const now = Date.now()
    const diff = now - ms
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
    return new Date(ms).toLocaleDateString('zh-CN')
  }

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
        console.log(loadError)
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

  useEffect(() => {
    const syncUser = () => setCurrentUser(getStoredUser())
    window.addEventListener(USER_UPDATED_EVENT, syncUser)
    window.addEventListener('storage', syncUser)
    return () => {
      window.removeEventListener(USER_UPDATED_EVENT, syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  useEffect(() => {
    if (!userId || !currentUser) return
    setComments((prev) =>
      prev.map((item) =>
        item.user_id === userId
          ? {
              ...item,
              nickname: currentUser.name || item.nickname,
              avatar: currentUser.avatar || DEFAULT_AVATAR,
            }
          : item,
      ),
    )
  }, [currentUser, userId])

  const handleLike = useCallback(async () => {
    if (!userId) {
      setActionFeedback('请先登录后再点赞')
      return
    }
    try {
      if (isLiked) {
        await unlikeContent({ content_id: contentId, content_type: ContentType.article })
        setLikeCount((c) => (c ?? 0) - 1)
        setIsLiked(false)
      } else {
        await likeContent({ content_id: contentId, content_type: ContentType.article })
        setLikeCount((c) => (c ?? 0) + 1)
        setIsLiked(true)
      }
      setActionFeedback('')
    } catch (e) {
      console.log(e)
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
        await uncollectContent({ content_id: contentId, content_type: ContentType.article })
        setCollectCount((c) => (c ?? 0) - 1)
        setIsCollected(false)
      } else {
        await collectContent({ content_id: contentId, content_type: ContentType.article })
        setCollectCount((c) => (c ?? 0) + 1)
        setIsCollected(true)
      }
      setActionFeedback('')
    } catch (e) {
      console.log(e)
      setActionFeedback(getErrorMessage(e, '操作失败，请稍后重试'))
    }
  }, [contentId, isCollected, userId])

  const fetchComments = useCallback(async () => {
    if (!contentId) return
    setCommentsLoading(true)
    try {
      const res = await getRootComment({
        content_type: ContentType.article,
        content_id: contentId,
        page: 1,
        page_size: 20,
      })
      const data = unwrapResponse(res) as RootComments | RootComment[]
      const list = Array.isArray(data) ? data : (data as RootComments)?.comments ?? []
      setComments(list)
    } catch (err) {
      console.log(err)
      setComments([])
    } finally {
      setCommentsLoading(false)
    }
  }, [contentId])

  useEffect(() => {
    if (contentId) void fetchComments()
  }, [contentId, fetchComments])

  const handlePublishComment = useCallback(async () => {
    if (!contentId || !commentInput.trim()) return
    if (!userId) {
      setActionFeedback('请先登录后再评论')
      return
    }
    const user = getStoredUser()
    const text = commentInput.trim()
    setPublishLoading(true)
    setActionFeedback('')
    try {
      const res = await addComment({
        content_id: contentId,
        content_type: ContentType.article,
        comment_text: text,
        parent_id: 0,
        reply_comment_id: 0,
        reply_user_id: 0,
        status: 0,
        user_name: user?.name || '',
        avatar: user?.avatar || DEFAULT_AVATAR,
      })
      setCommentInput('')
      const data = unwrapResponse(res) as ResponseComment
      const newComment: RootComment = {
        id: data.comment_id,
        type: 'article',
        target_id: contentId,
        user_id: userId,
        nickname: user?.name ?? '我',
        avatar: user?.avatar || DEFAULT_AVATAR,
        ip_location: '',
        content: text,
        sub_comment_count: 0,
        created_at: Date.now(),
        updated_at: Date.now(),
      }
      setComments((prev) => [newComment, ...prev])
    } catch (e) {
      console.log(e)
      setActionFeedback(getErrorMessage(e, '发布失败，请稍后重试'))
    } finally {
      setPublishLoading(false)
    }
  }, [contentId, commentInput, userId])

  const handleComment = useCallback(() => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const authorUserId = useMemo(() => getArticleCreatorUserId(article), [article])

  const contentState = useMemo(() => {
    if (article) {
      const publishedAt = article.published_at ? new Date(timestampToMs(article.published_at)) : null
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
        <div className="page-main-column">
          <article className="surface-card" style={{ padding: '32px', minWidth: 0 }}>
            {error && (
              <div style={{ marginBottom: '20px', fontSize: '13px', color: '#b45309' }}>
                {error}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
                ...(authorUserId ? { cursor: 'pointer' as const } : {}),
              }}
              onClick={
                authorUserId
                  ? () => {
                      navigate(`/user/${authorUserId}`)
                    }
                  : undefined
              }
              onKeyDown={
                authorUserId
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(`/user/${authorUserId}`)
                      }
                    }
                  : undefined
              }
              role={authorUserId ? 'button' : undefined}
              tabIndex={authorUserId ? 0 : undefined}
              title={authorUserId ? `查看作者「${contentState.author}」主页` : undefined}
            >
              <Avatar size={56} icon={<UserOutlined />} style={{ backgroundColor: '#8b5cf6' }} />
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>{contentState.author}</div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>
                  {authorUserId ? '点击查看作者主页 · 青少年安全与陪伴专栏' : '青少年安全与陪伴专栏'}
                </div>
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
              {renderArticleContent(contentState.content)}
            </div>
          </article>

          <div ref={commentSectionRef} className="surface-card" style={{ padding: '20px', marginTop: '0' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              {Math.max(comments.length, contentState.commentCount ?? 0)} 条评论
            </div>
            {actionFeedback ? <div style={{ marginBottom: '12px', fontSize: '13px', color: '#ff4d67' }}>{actionFeedback}</div> : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {commentsLoading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#909090' }}>加载中...</div>
              ) : comments.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#909090' }}>暂无评论，快来抢沙发吧</div>
              ) : (
                comments.map((item) => {
                  const isMe = item.user_id === userId
                  const rawName = (item as RootComment & { user_name?: string }).nickname ?? (item as RootComment & { user_name?: string }).user_name ?? '用户'
                  const name = isMe ? (currentUser?.name || rawName) : rawName
                  const text = (item as RootComment & { comment_text?: string }).content ?? (item as RootComment & { comment_text?: string }).comment_text ?? ''
                  const ts = (item as RootComment & { create_time?: number }).created_at ?? (item as RootComment & { create_time?: number }).create_time ?? 0
                  const avatarUrl = isMe ? (currentUser?.avatar || item.avatar || DEFAULT_AVATAR) : (item.avatar || DEFAULT_AVATAR)
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
                      <Avatar src={avatarUrl} icon={!avatarUrl ? <UserOutlined /> : undefined} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', color: '#606060', marginBottom: '4px' }}>
                          {name} · {formatCommentTime(ts)}
                        </div>
                        <div style={{ fontSize: '15px', color: '#0f0f0f', lineHeight: 1.5 }}>{text}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #ebebeb' }}>
              <input
                placeholder="善语结善缘，恶言伤人心"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void handlePublishComment()}
                style={{
                  flex: 1,
                  height: '40px',
                  background: '#f5f5f5',
                  borderRadius: '20px',
                  border: 'none',
                  padding: '0 16px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  color: publishLoading || !commentInput.trim() ? '#ccc' : '#FF2C55',
                  fontWeight: 600,
                  cursor: publishLoading || !commentInput.trim() ? 'not-allowed' : 'pointer',
                }}
                onClick={() => !publishLoading && commentInput.trim() && void handlePublishComment()}
              >
                {publishLoading ? '发布中...' : '发布'}
              </span>
            </div>
          </div>
        </div>

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
                <strong>{isLiked ? <HeartFilled style={{ color: '#ff2c55' }} /> : <HeartOutlined />} 点赞</strong>
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