import type { VideoItem } from '@/api/content/types'
import type { ArticleInfo } from '@/constants/content'

/** 从视频元数据推断创作者 userId（以后端实际字段为准，依次尝试） */
export function getVideoCreatorUserId(video: VideoItem): number | null {
  const v = video as VideoItem & { user_id?: number; author_id?: number }
  const candidates = [v.user_id, v.author_id, v.last_modified_by]
  for (const n of candidates) {
    if (typeof n === 'number' && Number.isFinite(n) && n > 0) return n
  }
  return null
}

/** 从文章元数据推断作者 userId（与视频规则一致） */
export function getArticleCreatorUserId(article: ArticleInfo | null | undefined): number | null {
  if (!article) return null
  const a = article as ArticleInfo & { user_id?: number; author_id?: number }
  const candidates = [a.user_id, a.author_id, a.last_modified_by]
  for (const n of candidates) {
    if (typeof n === 'number' && Number.isFinite(n) && n > 0) return n
  }
  return null
}
