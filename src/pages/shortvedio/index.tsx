import { CloseOutlined, HeartFilled, MessageFilled, ShareAltOutlined } from '@ant-design/icons'
import { likeContent, unlikeContent, getRootComment, addComment } from '@/api/content'
import type { ResponseComment, RootComments } from '@/constants/content'
import type { RootComment } from '@/constants/content'
import { useVideos } from '@/hooks/useVideos'
import { USER_UPDATED_EVENT, getCurrentUserId, getErrorMessage, getStoredUser, timestampToMs, unwrapResponse } from '@/utils/appState'
import { getVideoCreatorUserId } from '@/utils/contentUser'
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const DEFAULT_AVATAR = 'https://xiaoanv.oss-cn-beijing.aliyuncs.com/pics/avt.png'

interface VideoProgressState {
  currentTime: number
  duration: number
}
export const ContentType = {
  video: 'video',
  article: 'article',
  podcast: 'podcast',
  comic: 'comic',
} as const


function ShortVideo() {
  const navigate = useNavigate()
  const { vedios, loading, error } = useVideos()
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})
  const [activeVideoId, setActiveVideoId] = useState<number | null>(vedios[0]?.video_id ?? null)
  const [, setProgressMap] = useState<Record<number, VideoProgressState>>({})
  const [pausedMap, setPausedMap] = useState<Record<number, boolean>>({})
  const pausedMapRef = useRef<Record<number, boolean>>({})
  useEffect(() => {
    pausedMapRef.current = pausedMap
  }, [pausedMap])
  const [commentVisible, setCommentVisible] = useState(false)
  const [shareFeedbackId, setShareFeedbackId] = useState<number | null>(null)
  const [likeCountMap, setLikeCountMap] = useState<Record<number, number>>({})
  const [isLikedMap, setIsLikedMap] = useState<Record<number, boolean>>({})
  const [commentsMap, setCommentsMap] = useState<Record<number, RootComment[]>>({})
  const [commentCountMap, setCommentCountMap] = useState<Record<number, number>>({})
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [publishLoading, setPublishLoading] = useState(false)
  const [actionFeedback, setActionFeedback] = useState('')
  const currentUserId = getCurrentUserId()
  const [currentUser, setCurrentUser] = useState(getStoredUser())
  const tapTimerRef = useRef<Record<number, number>>({})
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; vid: number; x: number; y: number }[]>([])

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
    if (!currentUserId || !currentUser) return
    setCommentsMap((prev) => {
      const nextEntries = Object.entries(prev).map(([videoId, list]) => [
        videoId,
        list.map((item) =>
          item.user_id === currentUserId
            ? {
                ...item,
                nickname: currentUser.name || item.nickname,
                avatar: currentUser.avatar || DEFAULT_AVATAR,
              }
            : item,
        ),
      ])
      return Object.fromEntries(nextEntries) as Record<number, RootComment[]>
    })
  }, [currentUser, currentUserId])

  const formatCommentTime = (ts: number) => {
    const ms = timestampToMs(ts)
    const d = new Date(ms)
    const now = Date.now()
    const diff = now - ms
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
    return d.toLocaleDateString('zh-CN')
  }

  useEffect(() => {
    const initial: Record<number, number> = {}
    const liked: Record<number, boolean> = {}
    const counts: Record<number, number> = {}
    vedios.forEach((v) => {
      if (v.video_id != null) {
        initial[v.video_id] = v.like_count ?? 0
        liked[v.video_id] = Boolean(v.is_liked ?? (v.relation_status != null && (v.relation_status & 1) === 1))
        counts[v.video_id] = v.comment_count ?? 0
      }
    })
    setLikeCountMap(initial)
    setIsLikedMap(liked)
    setCommentCountMap(counts)
  }, [vedios])

  useEffect(() => {
    if (!vedios.length) {
      return
    }

    const pauseAllVideosExcept = (exceptVideoId: number) => {
      Object.entries(videoRefs.current).forEach(([id, el]) => {
        if (Number(id) !== exceptVideoId && el && !el.paused) el.pause()
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLVideoElement
          const videoId = Number(target.dataset.videoId)
          const videoEl = videoRefs.current[videoId]

          if (!videoEl) {
            return
          }

          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            setActiveVideoId(videoId)
            pauseAllVideosExcept(videoId)
            videoEl.currentTime = 0
            videoEl.play().catch((err) => {
              if (err?.name !== 'AbortError' && err?.name !== 'NotSupportedError') {
                console.warn('视频播放失败:', err)
              }
            })
          } else {
            videoEl.pause()
          }
        })
      },
      {
        threshold: [0.35, 0.65, 0.9],
      },
    )

    vedios.forEach((vedio) => {
      const vid = vedio.video_id
      if (vid != null) {
        const videoEl = videoRefs.current[vid]
        if (videoEl) observer.observe(videoEl)
      }
    })

    return () => observer.disconnect()
  }, [vedios])

  useEffect(() => {
    setCommentVisible(false)
    setShareFeedbackId(null)
    setActionFeedback('')
    setCommentInput('')
  }, [activeVideoId])

  const updateProgress = (videoId: number, currentTime: number, duration: number) => {
    setProgressMap((prev) => ({
      ...prev,
      [videoId]: {
        currentTime,
        duration,
      },
    }))
  }

  const handleToggleLike = useCallback(async (videoId: number) => {
    if (!currentUserId) {
      setActionFeedback('请先登录后再点赞')
      return
    }
    const isLiked = isLikedMap[videoId]
    try {
      if (isLiked) {
        await unlikeContent({ content_id: videoId, content_type: ContentType.video })
        setLikeCountMap((prev) => ({ ...prev, [videoId]: Math.max(0, (prev[videoId] ?? 0) - 1) }))
        setIsLikedMap((prev) => ({ ...prev, [videoId]: false }))
      } else {
        await likeContent({ content_id: videoId, content_type: ContentType.video})
        setLikeCountMap((prev) => ({ ...prev, [videoId]: (prev[videoId] ?? 0) + 1 }))
        setIsLikedMap((prev) => ({ ...prev, [videoId]: true }))
      }
      setActionFeedback('')
    } catch (e) {
      console.log(e)
      setActionFeedback(getErrorMessage(e, '点赞失败，请稍后重试'))
    }
  }, [currentUserId, isLikedMap])

  const handleTogglePlayback = useCallback((videoId: number) => {
    const videoEl = videoRefs.current[videoId]

    if (!videoEl) {
      return
    }

    if (videoEl.paused) {
      void videoEl.play().then(() => {
        setPausedMap((prev) => ({
          ...prev,
          [videoId]: false,
        }))
      }).catch((err) => {
        if (err?.name !== 'AbortError' && err?.name !== 'NotSupportedError') {
          console.warn('视频播放失败:', err)
        }
      })
    } else {
      videoEl.pause()
      setPausedMap((prev) => ({
        ...prev,
        [videoId]: true,
      }))
    }
  }, [])

  const handleVideoTap = useCallback((vid: number, e: ReactMouseEvent) => {
    const now = Date.now()
    const lastTap = tapTimerRef.current[vid] || 0

    if (now - lastTap < 300) {
      tapTimerRef.current[vid] = 0
      if (!isLikedMap[vid]) {
        void handleToggleLike(vid)
      }
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const heartId = now
      setFloatingHearts((prev) => [...prev, { id: heartId, vid, x: e.clientX - rect.left, y: e.clientY - rect.top }])
      setTimeout(() => setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId)), 800)
    } else {
      tapTimerRef.current[vid] = now
      handleTogglePlayback(vid)
    }
  }, [isLikedMap, handleToggleLike, handleTogglePlayback])

  const fetchComments = useCallback(async (videoId: number) => {
    setCommentsLoading(true)
    console.log('我开始获取评论了')
    console.log('我videoId是：', videoId)
    try {
      const res = await getRootComment({
        content_type: ContentType.video,
        content_id: videoId,
        page: 1,
        page_size: 20,
      })
      const data = unwrapResponse(res) as RootComments
      window.console.log('我data是：', data)
      const list = Array.isArray(data?.comments) ? data?.comments : []
      window.console.log('我list是：', list)
      setCommentsMap((prev) => ({
        ...prev,
        [videoId]: list,
      }))
    } catch (err) {
      console.log(err)
      setCommentsMap((prev) => ({ ...prev, [videoId]: [] }))
    } finally {
      setCommentsLoading(false)
    }
  }, [])

  const handleToggleComment = useCallback((videoId: number) => {

    console.log('我videoId是：', videoId)
    setCommentVisible((prev) => {
      const next = !prev
      if (next) {
        void fetchComments(videoId)
      }
      return next
    })
  }, [fetchComments])

  const handlePublishComment = useCallback(async () => {
    if (!activeVideoId || !commentInput.trim()) return
    if (!currentUserId) {
      setActionFeedback('请先登录后再评论')
      return
    }
    const user = getStoredUser()
    const text = commentInput.trim()
    setPublishLoading(true)
    setActionFeedback('')
    console.log('我开始发布了')
    console.log('评论内容是：', text)
    console.log('activeVideoId是：', activeVideoId)
    try {
      // console.log('activeVideoId是：', activeVideoId)
      const res = await addComment({
        content_id: activeVideoId,
        content_type: ContentType.video,
        comment_text: text,
        parent_id: 0,
        reply_comment_id: 0,
        reply_user_id: 0,
        status: 0,
        user_name: user?.name ?? '',
        avatar: user?.avatar || DEFAULT_AVATAR,
      })
      setCommentInput('')
      const data = unwrapResponse(res) as ResponseComment
      const newComment: RootComment = {
        id: data.comment_id,
        type: ContentType.video,
        target_id: activeVideoId,
        user_id: currentUserId,
        nickname: user?.name ?? '我',
        // ?? 只会判断 unll 或 undefined 我这个是空字符串 sb Ai
        avatar: user?.avatar || DEFAULT_AVATAR,
        ip_location: '',
        content: text,
        sub_comment_count: 0,
        created_at: Date.now(),
        updated_at: Date.now(),
      }
      console.log('我newComment是：', newComment)
      setCommentsMap((prev) => ({
        ...prev,
        [activeVideoId]: [newComment, ...(prev[activeVideoId] ?? [])],
      }))
      setCommentCountMap((prev) => ({
        ...prev,
        [activeVideoId]: (prev[activeVideoId] ?? 0) + 1,
      }))
    } catch (e) {
      console.log(e)
      setActionFeedback(getErrorMessage(e, '发布失败，请稍后重试'))
    } finally {
      setPublishLoading(false)
    }
  }, [activeVideoId, commentInput, currentUserId])

  const handleShare = async (videoId: number) => {
    const shareUrl = `${window.location.origin}/vedios/${videoId}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareFeedbackId(videoId)
      window.setTimeout(() => {
        setShareFeedbackId((current) => (current === videoId ? null : current))
      }, 1600)
    } catch (err) {
      console.log(err)
      window.prompt('复制链接', shareUrl)
    }
  }

  if (loading) {
    return (
      <div className="shortvideo-page">
        <div className="shortvideo-placeholder">视频加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="shortvideo-page">
        <div className="shortvideo-placeholder shortvideo-placeholder--error">
          {error}
          <span className="shortvideo-placeholder-hint">请先登录后查看短视频</span>
        </div>
      </div>
    )
  }

  if (!vedios.length) {
    return (
      <div className="shortvideo-page">
        <div className="shortvideo-placeholder">暂无视频</div>
      </div>
    )
  }

  return (
    <div className="shortvideo-page">
      <div className="shortvideo-feed">
        {vedios.filter((v): v is typeof v & { video_id: number } => v.video_id != null).map((vedio, index) => {
          const vid = vedio.video_id
          const isActive = activeVideoId === vid
          const isLiked = Boolean(isLikedMap[vid])
          const likeCount = likeCountMap[vid] ?? vedio.like_count ?? 0
          const commentCount = commentCountMap[vid] ?? vedio.comment_count ?? 0
          const creatorId = getVideoCreatorUserId(vedio)
          const goCreatorProfile = (e: ReactMouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (creatorId) navigate(`/user/${creatorId}`)
          }
        //   const progress = progressMap[vedio.video_id]
        //   const progressPercent = progress?.duration ? (progress.currentTime / progress.duration) * 100 : 0
          const isCommentOpen = commentVisible && isActive

          return (
            <section className="shortvideo-slide" key={vid}>
              <article className={`shortvideo-stage${isActive ? ' is-active' : ''}${isCommentOpen ? ' has-comment-open' : ''}`}>
                <div className="shortvideo-video-cell">
                <div className="shortvideo-player-box">
                  <video
                    ref={(element) => {
                      videoRefs.current[vid] = element
                    }}
                    className="shortvideo-player"
                    data-video-id={vid}
                    src={vedio.url}
                    loop
                    autoPlay
                    controls
                    muted={false}
                    playsInline
                    preload={index === 0 ? 'auto' : 'metadata'}
                    poster={vedio.cover}
                    onLoadedMetadata={(event) => {
                      updateProgress(vid, event.currentTarget.currentTime, event.currentTarget.duration || 0)
                    }}
                    onTimeUpdate={(event) => {
                      updateProgress(vid, event.currentTarget.currentTime, event.currentTarget.duration || 0)
                    }}
                    onError={(e) => {
                      const el = e.currentTarget
                      if (el.error) {
                        console.warn('视频加载失败:', vedio.url, el.error.message)
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleVideoTap(vid, e)
                    }}
                  />
                  {floatingHearts.filter((h) => h.vid === vid).map((h) => (
                    <span key={h.id} className="shortvideo-dbllike-heart" style={{ left: h.x, top: h.y }}>
                      <HeartFilled />
                    </span>
                  ))}
                </div>
                <div className="shortvideo-overlay shortvideo-overlay--bottom">
                    {actionFeedback && isActive ? (
                      <div className="shortvideo-action-feedback">{actionFeedback}</div>
                    ) : null}
                    <div className="shortvideo-meta">
                      <div
                        className={`shortvideo-author${creatorId ? ' is-clickable' : ''}`}
                        onClick={creatorId ? goCreatorProfile : undefined}
                        onKeyDown={
                          creatorId
                            ? (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  navigate(`/user/${creatorId}`)
                                }
                              }
                            : undefined
                        }
                        role={creatorId ? 'button' : undefined}
                        tabIndex={creatorId ? 0 : undefined}
                      >
                        @{vedio.author}
                      </div>
                      <div className="shortvideo-title">{vedio.name}</div>
                      <div className="shortvideo-subtitle">
                        第 {index + 1} 条短视频 · 整个视频完整展示
                      </div>
                    </div>
                    {/* // 操作按钮 */}
                    <div className="shortvideo-actions">
                      <div
                        className={`shortvideo-author-avatar${creatorId ? ' is-clickable' : ''}`}
                        title={creatorId ? `${vedio.author ?? ''}的主页` : vedio.author}
                        onClick={creatorId ? goCreatorProfile : undefined}
                        onKeyDown={
                          creatorId
                            ? (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  navigate(`/user/${creatorId}`)
                                }
                              }
                            : undefined
                        }
                        role={creatorId ? 'button' : undefined}
                        tabIndex={creatorId ? 0 : undefined}
                      >
                        <div className="shortvideo-author-avatar__inner">
                          {(vedio.author ?? '').slice(0, 1)}
                        </div>
                      </div>
                      <button
                        className={`shortvideo-action${isLiked ? ' is-liked' : ''}`}
                        onClick={() => void handleToggleLike(vid)}
                        type="button"
                      >
                        <HeartFilled />
                        <span>{likeCount >= 10000 ? `${(likeCount / 10000).toFixed(1)}w` : likeCount}</span>
                      </button>
                    <button
                      className={`shortvideo-action${isCommentOpen ? ' is-active' : ''}`}
                      onClick={() => handleToggleComment(vid)}
                      type="button"
                    >
                        <MessageFilled />
                        <span>{commentCount >= 10000 ? `${(commentCount / 10000).toFixed(1)}w` : commentCount}</span>
                      </button>
                      <button className="shortvideo-action" onClick={() => void handleShare(vid)} type="button">
                        <ShareAltOutlined />
                        <span>{shareFeedbackId === vid ? '已复制' : '分享'}</span>
                      </button>
                      {/* // 播放按钮 */}
                      {/* <button
                        className="shortvideo-action shortvideo-action--play"
                        onClick={() => handleTogglePlayback(vedio.video_id)}
                        type="button"
                      >
                        {isPaused ? <PlayCircleFilled /> : <PauseCircleFilled />}
                      </button> */}
                    </div>
                </div>

                {/* <div className="shortvideo-progress">
                    <div className="shortvideo-progress__track">
                      <div
                        className="shortvideo-progress__fill"
                        style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
                      />
                    </div>
                    </div> */}
                </div>

                <aside
                  className={`shortvideo-comment-drawer${isCommentOpen ? ' is-open' : ''}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="shortvideo-comment-header">
                    <span>{activeVideoId != null ? (commentCountMap[activeVideoId] ?? 0) : 0} 条评论</span>
                    <button className="shortvideo-comment-close" onClick={() => setCommentVisible(false)} type="button">
                      <CloseOutlined />
                    </button>
                  </div>
                  <div className="shortvideo-comment-list">
                    {commentsLoading ? (
                      <div className="shortvideo-comment-placeholder">加载中...</div>
                    ) : (() => {
                      const list = activeVideoId != null ? (commentsMap[activeVideoId] ?? []) : []
                      if (list.length === 0) {
                        return <div className="shortvideo-comment-placeholder">暂无评论，快来抢沙发吧</div>
                      }
                      return list.map((item, idx) => {
                        const isMe = (item as RootComment).user_id === currentUserId
                        const rawName = (item as RootComment & { user_name?: string }).nickname ?? (item as RootComment & { user_name?: string }).user_name ?? '用户'
                        const name = isMe ? (currentUser?.name || rawName) : rawName
                        const text = (item as RootComment & { comment_text?: string }).content ?? (item as RootComment & { comment_text?: string }).comment_text ?? ''
                        const ts = (item as RootComment & { create_time?: number }).created_at ?? (item as RootComment & { create_time?: number }).create_time ?? 0
                        const avatar = isMe
                          ? (currentUser?.avatar || (item as RootComment).avatar || DEFAULT_AVATAR)
                          : ((item as RootComment).avatar || DEFAULT_AVATAR)
                        const itemId = (item as RootComment).id ?? idx
                        return (
                          <div className="shortvideo-comment-item" key={itemId} data-comment-id={itemId}>
                            <div className="shortvideo-comment-avatar">
                              {avatar ? (
                                <img src={avatar} alt="" />
                              ) : (
                                <span>{name.slice(0, 1)}</span>
                              )}
                            </div>
                            <div className="shortvideo-comment-body">
                              <div className="shortvideo-comment-meta">
                                <span className="shortvideo-comment-user">{name}</span>
                                <span className="shortvideo-comment-time">{formatCommentTime(ts)}</span>
                              </div>
                              <div className="shortvideo-comment-text">{text}</div>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                  <div className="shortvideo-comment-input">
                    <input
                      placeholder="善语结善缘，恶言伤人心"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && void handlePublishComment()}
                    />
                    <button type="button" disabled={publishLoading || !commentInput.trim()} onClick={() => void handlePublishComment()}>
                      {publishLoading ? '发布中...' : '发布'}
                    </button>
                  </div>
                  {actionFeedback ? <div className="shortvideo-comment-feedback shortvideo-comment-feedback--error">{actionFeedback}</div> : null}
                </aside>
              </article>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default ShortVideo