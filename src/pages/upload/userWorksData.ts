import type { ArticleSummary, ComicSummary, PodcastSummary, UserAllContent, VideoSummary } from '@/constants/content'

/** 兼容 code 为字符串、数据在 data 或顶层的多种返回 */
function isApiSuccess(code: unknown): boolean {
  const n = Number(code)
  if (code === undefined || code === null || Number.isNaN(n)) return true
  return n === 0 || n === 200
}

export function emptyWorks(): UserAllContent {
  return { articles: [], videos: [], podcasts: [], comics: [] }
}

export function parseUserAllContentPayload(res: unknown): { ok: boolean; data: UserAllContent; message?: string } {
  if (res == null || typeof res !== 'object') {
    return { ok: false, data: emptyWorks(), message: '响应格式异常' }
  }
  const o = res as Record<string, unknown>
  if (!isApiSuccess(o.code)) {
    const msg = typeof o.message === 'string' && o.message ? o.message : '获取作品列表失败'
    return { ok: false, data: emptyWorks(), message: msg }
  }
  const nested = o.data
  const hasNested =
    nested != null &&
    typeof nested === 'object' &&
    ('articles' in nested || 'videos' in nested || 'podcasts' in nested || 'comics' in nested)
  const src = (hasNested ? nested : o) as Record<string, unknown>
  return {
    ok: true,
    data: {
      articles: Array.isArray(src.articles) ? (src.articles as ArticleSummary[]) : [],
      videos: Array.isArray(src.videos) ? (src.videos as VideoSummary[]) : [],
      podcasts: Array.isArray(src.podcasts) ? (src.podcasts as PodcastSummary[]) : [],
      comics: Array.isArray(src.comics) ? (src.comics as ComicSummary[]) : [],
    },
  }
}

export function firstNonEmptySubTab(d: UserAllContent): string {
  if (d.articles.length) return 'articles'
  if (d.videos.length) return 'videos'
  if (d.podcasts.length) return 'podcasts'
  if (d.comics.length) return 'comics'
  return 'articles'
}
