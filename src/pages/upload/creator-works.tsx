import { useNavigate } from 'react-router-dom'
import { Empty, Spin, Tabs } from 'antd'
import { EyeOutlined, LikeOutlined } from '@ant-design/icons'
import type { ArticleSummary, ComicSummary, PodcastSummary, UserAllContent, VideoSummary } from '@/constants/content'
import { timestampToMs } from '@/utils/appState'
import { firstNonEmptySubTab } from './userWorksData'

function cardActivateProps(onOpen: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: () => void onOpen(),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        void onOpen()
      }
    },
  }
}

function formatDate(publishedAt: number): string {
  if (!publishedAt) return '—'
  const d = new Date(timestampToMs(publishedAt))
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function WorkGrid({
  children,
  empty,
}: {
  children: React.ReactNode
  empty: boolean
}) {
  if (empty) {
    return (
      <div style={{ padding: '32px 0' }}>
        <Empty description="暂无内容" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }
  return <div className="creator-works-grid">{children}</div>
}

function articleCard(
  a: ArticleSummary,
  navigate: ReturnType<typeof useNavigate>,
) {
  return (
    <div key={`article-${a.article_id}`} className="creator-work-card" style={{ cursor: 'pointer' }} onClick={() => void navigate(`/news/${a.article_id}`)}>
      <div className="creator-work-card__cover">
        {a.cover ? (
          <img src={a.cover} alt="" />
        ) : (
          <div className="creator-work-card__ph">无封面</div>
        )}
      </div>
      <div className="creator-work-card__body">
        <div className="creator-work-card__title" title={a.name}>
          {a.name}
        </div>
        <div className="creator-work-card__desc">{a.description || ' '}</div>
        <div className="creator-work-card__foot">
          <span className="creator-work-card__date">{formatDate(a.published_at)}</span>
          <span>
            <EyeOutlined /> {a.view_count ?? 0}
          </span>
          <span>
            <LikeOutlined /> {a.like_count ?? 0}
          </span>
        </div>
      </div>
    </div>
  )
}

function videoCard(
  v: VideoSummary,
  navigate: ReturnType<typeof useNavigate>,
) {
  return (
    <div key={`video-${v.video_id}`} className="creator-work-card" style={{ cursor: 'pointer' }} onClick={() => void navigate(`/vedios/${v.video_id}`)}>
      <div className="creator-work-card__cover">
        {v.cover ? (
          <img src={v.cover} alt="" />
        ) : (
          <div className="creator-work-card__ph">无封面</div>
        )}
      </div>
      <div className="creator-work-card__body">
        <div className="creator-work-card__title" title={v.name}>
          {v.name}
        </div>
        <div className="creator-work-card__desc">{v.description || ' '}</div>
        <div className="creator-work-card__foot">
          <span className="creator-work-card__date">{formatDate(v.published_at)}</span>
          <span>
            <EyeOutlined /> {v.view_count ?? 0}
          </span>
          <span>
            <LikeOutlined /> {v.like_count ?? 0}
          </span>
        </div>
      </div>
    </div>
  )
}

function podcastCard(p: PodcastSummary, navigate: ReturnType<typeof useNavigate>) {
  return (
    <div key={`podcast-${p.podcast_id}`} className="creator-work-card" style={{ cursor: 'pointer' }} onClick={() => void navigate('/podcast')}>
      <div className="creator-work-card__cover">
        {p.cover ? (
          <img src={p.cover} alt="" />
        ) : (
          <div className="creator-work-card__ph">无封面</div>
        )}
      </div>
      <div className="creator-work-card__body">
        <div className="creator-work-card__title" title={p.name}>
          {p.name}
        </div>
        <div className="creator-work-card__desc">{p.description || ' '}</div>
        <div className="creator-work-card__foot">
          <span className="creator-work-card__date">{formatDate(p.published_at)}</span>
          <span>
            <EyeOutlined /> {p.view_count ?? 0}
          </span>
          <span>
            <LikeOutlined /> {p.like_count ?? 0}
          </span>
        </div>
      </div>
    </div>
  )
}

function comicCard(c: ComicSummary, navigate: ReturnType<typeof useNavigate>) {
  return (
    <div key={`comic-${c.comic_id}`} className="creator-work-card" style={{ cursor: 'pointer' }} onClick={() => void navigate('/cartoon')}>
      <div className="creator-work-card__cover">
        {c.cover ? (
          <img src={c.cover} alt="" />
        ) : (
          <div className="creator-work-card__ph">无封面</div>
        )}
      </div>
      <div className="creator-work-card__body">
        <div className="creator-work-card__title" title={c.name}>
          {c.name}
        </div>
        <div className="creator-work-card__desc">{c.description || ' '}</div>
        <div className="creator-work-card__foot">
          <span>
            章节 {c.chapter_count ?? 0}
          </span>
          <span>
            <LikeOutlined /> {c.like_count ?? 0}
          </span>
        </div>
      </div>
    </div>
  )
}

function renderPanels(data: UserAllContent, navigate: ReturnType<typeof useNavigate>) {
  const a = data.articles ?? []
  const v = data.videos ?? []
  const p = data.podcasts ?? []
  const c = data.comics ?? []
  return [
    {
      key: 'articles',
      label: `文章 (${a.length})`,
      children: (
        <WorkGrid empty={a.length === 0}>
          {a.map((item) => articleCard(item, navigate))}
        </WorkGrid>
      ),
    },
    {
      key: 'videos',
      label: `视频 (${v.length})`,
      children: (
        <WorkGrid empty={v.length === 0}>
          {v.map((item) => videoCard(item, navigate))}
        </WorkGrid>
      ),
    },
    {
      key: 'podcasts',
      label: `播客 (${p.length})`,
      children: (
        <WorkGrid empty={p.length === 0}>
          {p.map((item) => podcastCard(item, navigate))}
        </WorkGrid>
      ),
    },
    {
      key: 'comics',
      label: `条漫 (${c.length})`,
      children: (
        <WorkGrid empty={c.length === 0}>
          {c.map((item) => comicCard(item, navigate))}
        </WorkGrid>
      ),
    },
  ]
}

type CreatorWorksProps = {
  /** 由上传页在 mount 时请求，避免 Tab 未渲染导致不发请求 */
  loading: boolean
  data: UserAllContent | null
  error: string | null
}

export default function CreatorWorks({ loading, data, error: loadError }: CreatorWorksProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="creator-works-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="creator-works-wrap" style={{ padding: '32px' }}>
        <Empty description={loadError} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="creator-works-wrap" style={{ padding: '32px' }}>
        <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  return (
    <div className="creator-works-wrap" style={{ minHeight: 240 }}>
      <Tabs
        key="creator-works-data"
        type="line"
        size="large"
        defaultActiveKey={firstNonEmptySubTab(data)}
        items={renderPanels(data, navigate)}
      />
    </div>
  )
}
