import { CloseOutlined, HeartFilled, MessageFilled, PauseCircleFilled, PlayCircleFilled, ShareAltOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/store/hooks'
import { getAllVedios } from '@/features/vedios/vediosSlice'
import { useEffect, useRef, useState } from 'react'
import './index.css'

interface VideoProgressState {
  currentTime: number
  duration: number
}

function ShortVideo() {
  const vedios = useAppSelector(getAllVedios)
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})
  const [activeVideoId, setActiveVideoId] = useState<number | null>(vedios[0]?.id ?? null)
  const [progressMap, setProgressMap] = useState<Record<number, VideoProgressState>>({})
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({})
  const [pausedMap, setPausedMap] = useState<Record<number, boolean>>({})
  const [commentVisible, setCommentVisible] = useState(false)
  const [shareFeedbackId, setShareFeedbackId] = useState<number | null>(null)
  const commentItems = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    user: `用户 ${index + 1}`,
    text: `这是第 ${index + 1} 条评论的内容，感觉这个视频非常有意义！`,
  }))

  useEffect(() => {
    if (!vedios.length) {
      return
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
            const isPausedManually = pausedMap[videoId]

            if (!isPausedManually) {
              void videoEl.play().catch(() => undefined)
            }
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
      const videoEl = videoRefs.current[vedio.id]
      if (videoEl) {
        observer.observe(videoEl)
      }
    })

    return () => observer.disconnect()
  }, [pausedMap, vedios])

  useEffect(() => {
    setCommentVisible(false)
    setShareFeedbackId(null)
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

  const handleToggleLike = (videoId: number) => {
    setLikedMap((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  const handleTogglePlayback = (videoId: number) => {
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
      }).catch(() => undefined)
    } else {
      videoEl.pause()
      setPausedMap((prev) => ({
        ...prev,
        [videoId]: true,
      }))
    }
  }

  const handleShare = async (videoId: number) => {
    const shareUrl = `${window.location.origin}/shortvideo/details/${videoId}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareFeedbackId(videoId)
      window.setTimeout(() => {
        setShareFeedbackId((current) => (current === videoId ? null : current))
      }, 1600)
    } catch {
      window.prompt('复制链接', shareUrl)
    }
  }

  return (
    <div className="shortvideo-page">
      <div className="shortvideo-feed">
        {vedios.map((vedio, index) => {
          const isActive = activeVideoId === vedio.id
          const isLiked = Boolean(likedMap[vedio.id])
          const isPaused = Boolean(pausedMap[vedio.id])
          const progress = progressMap[vedio.id]
          const progressPercent = progress?.duration ? (progress.currentTime / progress.duration) * 100 : 0
          const isCommentOpen = commentVisible && isActive

          return (
            <section className="shortvideo-slide" key={vedio.id}>
              <article className={`shortvideo-stage${isActive ? ' is-active' : ''}${isCommentOpen ? ' has-comment-open' : ''}`}>
                <div className="shortvideo-stage-main">
                  <video
                    ref={(element) => {
                      videoRefs.current[vedio.id] = element
                    }}
                    className="shortvideo-player"
                    data-video-id={vedio.id}
                    src={vedio.url}
                    loop
                    muted
                    playsInline
                    preload={index === 0 ? 'auto' : 'metadata'}
                    poster={vedio.cover}
                    onLoadedMetadata={(event) => {
                      updateProgress(vedio.id, event.currentTarget.currentTime, event.currentTarget.duration || 0)
                    }}
                    onTimeUpdate={(event) => {
                      updateProgress(vedio.id, event.currentTarget.currentTime, event.currentTarget.duration || 0)
                    }}
                    onClick={() => handleTogglePlayback(vedio.id)}
                  />

                  <div className="shortvideo-overlay shortvideo-overlay--bottom">
                    <div className="shortvideo-meta">
                      <div className="shortvideo-author">@{vedio.author}</div>
                      <div className="shortvideo-title">{vedio.title}</div>
                      <div className="shortvideo-subtitle">
                        第 {index + 1} 条短视频 · 整个视频完整展示
                      </div>
                    </div>

                    <div className="shortvideo-actions">
                      <div className="shortvideo-author-avatar" title={vedio.author}>
                        <div className="shortvideo-author-avatar__inner">
                          {vedio.author.slice(0, 1)}
                        </div>
                      </div>
                      <button
                        className={`shortvideo-action${isLiked ? ' is-liked' : ''}`}
                        onClick={() => handleToggleLike(vedio.id)}
                        type="button"
                      >
                        <HeartFilled />
                        <span>{isLiked ? 13 + index : 12 + index}w</span>
                      </button>
                    <button
                      className={`shortvideo-action${isCommentOpen ? ' is-active' : ''}`}
                      onClick={() => setCommentVisible((prev) => (isCommentOpen ? false : !prev))}
                      type="button"
                    >
                        <MessageFilled />
                        <span>{800 + index * 13}</span>
                      </button>
                      <button className="shortvideo-action" onClick={() => void handleShare(vedio.id)} type="button">
                        <ShareAltOutlined />
                        <span>{shareFeedbackId === vedio.id ? '已复制' : '分享'}</span>
                      </button>
                      <button
                        className="shortvideo-action shortvideo-action--play"
                        onClick={() => handleTogglePlayback(vedio.id)}
                        type="button"
                      >
                        {isPaused ? <PlayCircleFilled /> : <PauseCircleFilled />}
                      </button>
                    </div>
                  </div>

                  <div className="shortvideo-progress">
                    <div className="shortvideo-progress__track">
                      <div
                        className="shortvideo-progress__fill"
                        style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <aside
                  className={`shortvideo-comment-drawer${isCommentOpen ? ' is-open' : ''}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="shortvideo-comment-header">
                    <span>8562 条评论</span>
                    <button className="shortvideo-comment-close" onClick={() => setCommentVisible(false)} type="button">
                      <CloseOutlined />
                    </button>
                  </div>

                  <div className="shortvideo-comment-list">
                    {commentItems.map((item) => (
                      <div className="shortvideo-comment-item" key={item.id}>
                        <div className="shortvideo-comment-avatar">{item.user.slice(-1)}</div>
                        <div className="shortvideo-comment-body">
                          <div className="shortvideo-comment-user">{item.user}</div>
                          <div className="shortvideo-comment-text">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="shortvideo-comment-input">
                    <input placeholder="善语结善缘，恶言伤人心" />
                    <button type="button">发布</button>
                  </div>
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