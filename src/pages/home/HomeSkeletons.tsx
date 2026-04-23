import type { CSSProperties } from 'react'
import './homeSkeletons.css'

function ShimmerBlock({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`home-sk-base ${className ?? ''}`} style={style} aria-hidden />
}

/**
 * 顶部大轮播/精选位（默认 420px 与文章页 cartoon-carousel 一致；首页可传 heightPx=360）
 */
export function FeaturedCarouselSkeleton({ heightPx = 420 }: { heightPx?: number }) {
  return (
    <ShimmerBlock
      className="home-sk-featured-carousel"
      style={{ width: '100%', height: heightPx, borderRadius: heightPx <= 360 ? 16 : 24 }}
    />
  )
}

/** 编辑精选横向三卡（与文章页 grid-auto-cards 一致） */
export function EditorPicksRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="home-sk-pick-row">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`ep-${i}`} className="home-sk-pick-card home-sk-pick-card--row-item">
          <ShimmerBlock className="home-sk-line home-sk-line--lg" />
          <ShimmerBlock className="home-sk-line home-sk-line--sm" />
        </div>
      ))}
    </div>
  )
}

/** 最新文章列表骨架（左图右文） */
export function ArticleFeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`af-${i}`} className="home-sk-article-row">
          <ShimmerBlock className="home-sk-article-thumb" />
          <div className="home-sk-article-text">
            <ShimmerBlock className="home-sk-line home-sk-line--lg" />
            <ShimmerBlock className="home-sk-line home-sk-line--md" />
            <ShimmerBlock className="home-sk-line home-sk-line--sm" />
          </div>
        </div>
      ))}
    </>
  )
}

/** 推荐视频网格骨架（封面 + 头像 + 两行标题） */
export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`vg-${i}`} className="home-sk-video-card">
          <ShimmerBlock className="home-sk-video-thumb" />
          <div className="home-sk-video-meta">
            <ShimmerBlock className="home-sk-avatar" />
            <div className="home-sk-video-lines">
              <ShimmerBlock className="home-sk-line home-sk-line--md" />
              <ShimmerBlock className="home-sk-line home-sk-line--sm" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

/** 继续观看侧栏 */
export function SidebarVideoSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`sv-${i}`} className="home-sk-sidebar-row">
          <ShimmerBlock className="home-sk-sidebar-thumb" />
          <div className="home-sk-sidebar-text">
            <ShimmerBlock className="home-sk-line home-sk-line--md" />
            <ShimmerBlock className="home-sk-line home-sk-line--sm" />
          </div>
        </div>
      ))}
    </>
  )
}

/** 编辑精选侧栏 */
export function SidebarPickSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`sp-${i}`} className="home-sk-pick-card">
          <ShimmerBlock className="home-sk-line home-sk-line--lg" />
          <ShimmerBlock className="home-sk-line home-sk-line--sm" />
        </div>
      ))}
    </>
  )
}
