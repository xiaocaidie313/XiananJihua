import type { VideoItem } from '@/api/content/types'
import type { ArticleSummary } from '@/constants/content'

const KEY_ARTICLES = 'xiaoan:home:articles:v1'
const KEY_VIDEOS = 'xiaoan:home:videos:v1'

function safeParse<T>(raw: string | null, guard: (v: unknown) => v is T): T | null {
  if (raw == null || raw === '') return null
  try {
    const v = JSON.parse(raw) as unknown
    return guard(v) ? v : null
  } catch {
    return null
  }
}

export function readHomeArticlesCache(): ArticleSummary[] {
  const data = safeParse(sessionStorage.getItem(KEY_ARTICLES), (v): v is ArticleSummary[] =>
    Array.isArray(v),
  )
  return data ?? []
}

export function writeHomeArticlesCache(articles: ArticleSummary[]): void {
  try {
    sessionStorage.setItem(KEY_ARTICLES, JSON.stringify(articles))
  } catch {
    /* ignore quota */
  }
}

export function readHomeVideosCache(): VideoItem[] {
  const data = safeParse(sessionStorage.getItem(KEY_VIDEOS), (v): v is VideoItem[] =>
    Array.isArray(v),
  )
  return data ?? []
}

export function writeHomeVideosCache(videos: VideoItem[]): void {
  try {
    sessionStorage.setItem(KEY_VIDEOS, JSON.stringify(videos))
  } catch {
    /* ignore quota */
  }
}
