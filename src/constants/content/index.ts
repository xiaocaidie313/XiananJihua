import type { Tag } from '../../api/content/types'


/** 内容类型 */
export const ContentTypeId = {
  video_id: 'video_id',
  article_id: 'article_id',
  podcast_id: 'podcast_id',
  comic_id: 'comic_id',
} as const

/** 内容响应 */
export interface ResponseContent {
  [key: string]: number
  relation_status: number
}
export interface ResponseComment {
  comment_id: number
  relation_status: number

}

export interface ArticleSummary {
  article_id: number
  name: string
  url: string
  description: string
  cover: string
  content?: string
  author: string
  published_at: number
  created_at: number
  updated_at: number
  like_count: number
  view_count: number
  collect_count: number
  comment_count: number
  /** 作者头像（若后端在内容接口中返回） */
  avatar?: string
  author_avatar?: string
  /** 作者用户 ID，接口若返回则优先用于跳转个人主页 */
  user_id?: number
  author_id?: number
  last_modified_by: number
  relation_status: number
}

/** 文章信息 */
export interface ArticleInfo extends ArticleSummary {
  tags: Tag[]
  content: string
  is_liked: boolean
  is_collected: boolean
}

export interface Article {
  article: ArticleInfo
}

export interface VideoSummary {
  video_id: number
  name: string
  url: string
  description: string
  cover: string
  author: string
  published_at: number
  created_at: number
  updated_at: number
  like_count: number
  view_count: number
  collect_count: number
  comment_count: number
  last_modified_by: number
  relation_status: number
}

/** 视频信息 */
export interface VideoInfo extends VideoSummary {
  tags: Tag[]
  is_liked?: boolean
  is_collected?: boolean
}

export interface Video {
  video: VideoInfo
}

/** 播客信息 */
export interface PodcastHighlight {
  second: number
  highlight: string
}

export interface PodcastSummary {
  podcast_id: number
  name: string
  url: string
  description: string
  cover: string
  author: string
  channel: string
  status: number
  published_at: number
  created_at: number
  updated_at: number
  like_count: number
  view_count: number
  collect_count: number
  comment_count: number
  last_modified_by: number
  relation_status: number
}

export interface PodcastInfo extends PodcastSummary {
  tags: Tag[]
  highlights: PodcastHighlight[]
  is_liked: boolean
  is_collected: boolean
}

export interface Podcast {
  podcast: PodcastInfo
}

/** 漫画信息 */
export interface ComicSummary {
  comic_id: number
  name: string
  description: string
  cover: string
  author: string
  published_at: number
  created_at: number
  updated_at: number
  like_count: number
  view_count: number
  collect_count: number
  comment_count: number
  chapter_count: number
  last_modified_by: number
  relation_status: number
}

export interface ComicInfo extends ComicSummary {
  tags: Tag[]
  is_liked: boolean
  is_collected: boolean
}

export interface Comic {
  comic: ComicInfo
}

export interface ComicChapter {
  comic_chapter_id: number
  comic_id: number
  chapter_no: number
  title: string
  description: string
  status: number
  page_count: number
  published_at: number
  created_at: number
  updated_at: number
}

export interface ComicPage {
  comic_chapter_page_id: number
  comic_chapter_id: number
  page_no: number
  page_url: string
  created_at: number
  updated_at: number
}

export interface ComicChapters {
  chapters: ComicChapter[]
}

export interface ComicPages {
  pages: ComicPage[]
}

/** 评论 */
export interface RootComment {
  id: number
  type: string
  target_id: number
  user_id: number
  nickname: string
  avatar: string
  ip_location: string
  content: string
  sub_comment_count: number
  created_at: number
  updated_at: number
}

export interface SubComment {
  id: number
  parent_id: number
  reply_comment_id: number
  reply_user_id: number
  content: string
  created_at: number
  updated_at: number
  is_liked: boolean
}

export interface RootComments {
  comments: RootComment[]
}

export interface SubComments {
  comments: SubComment[]
}

/** 游标分页列表 */
export interface ArticleList {
  articles: ArticleSummary[]
  has_more: boolean
  next_cursor: number
}

export interface ComicList {
  comics: ComicSummary[]
  has_more: boolean
  next_cursor: number
}

export interface PodcastList {
  podcasts: PodcastSummary[]
  has_more: boolean
  next_cursor: number
}

export interface VideoList {
  videos: VideoSummary[]
  has_more: boolean
  next_cursor: number
}

/** 用户创作中心：全部作品 */
export interface UserAllContent {
  articles: ArticleSummary[]
  videos: VideoSummary[]
  podcasts: PodcastSummary[]
  comics: ComicSummary[]
}
