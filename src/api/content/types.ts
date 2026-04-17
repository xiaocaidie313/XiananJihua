/** 标签类型 */
export type Tag = string

/** 添加文章参数类型 */
export interface AddArticleParams {
  author: string
  content: string
  cover: string
  description: string
  name: string
  published_at: number
  tags: Tag[]
  url: string
}

/** 修改文章参数类型 */
export interface ModifyArticleParams extends AddArticleParams {
  article_id: number
}

/** 添加视频参数类型 */
export interface AddVideoParams {
  author: string
  cover: string
  description: string
  name: string
  published_at: number
  tags: Tag[]
  url: string
}

/** 修改视频参数类型 */
export interface ModifyVideoParams extends AddVideoParams {
  video_id: number
}
/** 返回视频的参数 */
export interface VideoItem {
    video_id?: number;
    name ?: string;
    tags ?: string[];
    url ?: string;
    description ?: string;
    cover ?: string;
    author ?: string;
    published_at?: number;
    created_at: number;
    updated_at?: number;
    like_count ?: number;
    view_count ?: number;
    collect_count ?: number;
    comment_count ?: number;
    /** 上传者 / 创作者用户 ID，有则用于跳转个人主页 */
    user_id?: number;
    author_id?: number;
    last_modified_by?: number;
    relation_status?: number;
    is_liked?: boolean;
    is_collected?: boolean;
  }

/** 添加播客参数类型 */
export interface AddPodcastParams {
  author: string
  channel: string
  cover: string
  description: string
  highlights: { highlight: string; second: number }[]
  name: string
  published_at: number
  status: number
  tags: Tag[]
  url: string
}

/** 修改播客参数类型 */
export interface ModifyPodcastParams extends AddPodcastParams {
  podcast_id: number
}

/** 添加漫画参数类型 */
export interface AddComicParams {
  author: string
  cover: string
  description: string
  name: string
  published_at: number
  tags: Tag[]
}

/** 修改漫画参数类型 */
export interface ModifyComicParams extends AddComicParams {
  comic_id: number
}

/** 添加漫画章节参数类型 */
export interface AddComicChapterParams {
  comic_id: number
  chapter_no: number
  title: string
  description: string
  page_urls: string[]
  published_at: number
  status: number
}

/** 修改漫画章节参数类型 */
export interface ModifyComicChapterParams extends AddComicChapterParams {
  comic_chapter_id: number
}

/** 获取漫画章节参数类型 */
export interface GetComicChapterParams {
  comic_id: number
  page: number
  page_size: number
}

/** 获取漫画页面参数类型 */
export interface GetComicPageParams {
  comic_chapter_id: number
  page: number
  page_size: number
}

/** 添加评论参数类型 */
export interface AddCommentParams {
  avatar: string
  comment_text: string
  content_id: number
  content_type: string
  parent_id: number
  reply_comment_id: number
  reply_user_id: number
  status: number
  user_name: string
}

/** 获取根评论参数类型 */
export interface GetRootCommentParams {
  content_type: string
  content_id: number
  page: number
  page_size: number
}

/** 获取子评论参数类型 */
export interface GetSubCommentParams {
  content_type: string
  content_id: number
  parent_comment_id: number
  page: number
  page_size: number
}

/** 内容通用参数 */
export interface ContentActionParams {
  content_id: number
  content_type: string
}

/** 游标分页参数 */
export interface CursorPageParams {
  page_size: number
  cursor: number
}
