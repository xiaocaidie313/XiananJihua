import './homeSkeletons.css'

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={`home-sk-base ${className ?? ''}`} aria-hidden />
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
