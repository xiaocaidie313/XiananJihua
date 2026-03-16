import type {
  Article,
  ArticleList,
  Comic,
  ComicChapters,
  ComicList,
  ComicPages,
  Podcast,
  PodcastList,
  ResponseContent,
  ResponseComment,
  RootComments,
  SubComments,
  Video,
  VideoList,
} from '../../constants/content'
import instance, { type CommonResponse } from '../../utils/http'
import type {
  AddArticleParams,
  AddCommentParams,
  AddComicChapterParams,
  AddComicParams,
  AddPodcastParams,
  AddVideoParams,
  ContentActionParams,
  CursorPageParams,
  GetComicChapterParams,
  GetComicPageParams,
  GetRootCommentParams,
  GetSubCommentParams,
  ModifyArticleParams,
  ModifyComicChapterParams,
  ModifyComicParams,
  ModifyPodcastParams,
  ModifyVideoParams,
} from './types'


const authHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `${token}` } : {}
}

/** 添加文章 */
export const addArticle = (params: AddArticleParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/add-article', params, { header: authHeader() })
}

/** 获取文章详情 */
export const getArticleInfo = (id: number) => {
  return instance.get<CommonResponse<Article>>('/api/content/get-article-content', { article_id: id }, { header: authHeader() })
}

/** 修改文章 */
export const modifyArticle = (params: ModifyArticleParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/modify-article', params, { header: authHeader() })
}

/** 删除文章 */
export const deleteArticle = (id: number) => {
  return instance.del<CommonResponse<Record<string, never>>>('/api/content/delete-article', { article_id: id }, { header: authHeader() })
}

/** 添加视频 */
export const addVideo = (params: AddVideoParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/add-video', params, { header: authHeader() })
}

/** 获取视频详情 */
export const getVideoContent = (id: number) => {
  return instance.get<CommonResponse<Video>>('/api/content/get-video-content', { video_id: id }, { header: authHeader() })
}

/** 修改视频 */
export const modifyVideo = (params: ModifyVideoParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/modify-video', params, { header: authHeader() })
}

/** 删除视频 */
export const deleteVideo = (id: number) => {
  return instance.del<CommonResponse<Record<string, never>>>('/api/content/delete-video', { video_id: id }, { header: authHeader() })
}

/** 添加播客 */
export const addPodcast = (params: AddPodcastParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/add-podcast', params, { header: authHeader() })
}

/** 获取播客内容 */
export const getPodcastContent = (id: number) => {
  return instance.get<CommonResponse<Podcast>>('/api/content/get-podcast-content', { podcast_id: id }, { header: authHeader() })
}

/** 修改播客 */
export const modifyPodcast = (params: ModifyPodcastParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/modify-podcast', params, { header: authHeader() })
}

/** 删除播客 */
export const deletePodcast = (id: number) => {
  return instance.del<CommonResponse<Record<string, never>>>('/api/content/delete-podcast', { podcast_id: id }, { header: authHeader() }        )
}

/** 添加漫画 */
export const addComic = (params: AddComicParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/add-comic', params, { header: authHeader() })
}

/** 添加漫画章节 */
export const addComicChapter = (params: AddComicChapterParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/add-comic-chapter', params, { header: authHeader() })
}

/** 获取漫画 */
export const getComic = (id: number) => {
  return instance.get<CommonResponse<Comic>>('/api/content/get-comic', { comic_id: id }, { header: authHeader() })
}

/** 获取漫画章节 */
export const getComicChapter = (params: GetComicChapterParams) => {
  return instance.get<CommonResponse<ComicChapters>>('/api/content/get-comic-chapter', params, { header: authHeader() })
}

/** 获取漫画页面 */
export const getComicPage = (params: GetComicPageParams) => {
  return instance.get<CommonResponse<ComicPages>>('/api/content/get-comic-page', params, { header: authHeader() })
}

/** 修改漫画 */
export const modifyComic = (params: ModifyComicParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/modify-comic', params, { header: authHeader() })
}

/** 修改漫画章节 */
export const modifyComicChapter = (params: ModifyComicChapterParams) => {
  return instance.post<CommonResponse<ResponseContent>>('/api/content/modify-comic-chapter', params, { header: authHeader() })
}

/** 删除漫画章节 */
export const deleteComicChapter = (comic_chapter_id: number, comic_id: number) => {
  return instance.del<CommonResponse<Record<string, never>>>('/api/content/delete-comic-chapter', {
    comic_chapter_id,
    comic_id,
  }, { header: authHeader() })
}

/** 删除漫画 */
export const deleteComic = (id: number) => {
  return instance.del<CommonResponse<Record<string, never>>>('/api/content/delete-comic', { comic_id: id }, { header: authHeader() })
}

/** 添加评论 */
export const addComment = (params: AddCommentParams) => {
  return instance.post<CommonResponse<ResponseComment>>('/api/content/add-comment', params, { header: authHeader() })
}

/** 获取根评论 */
export const getRootComment = (params: GetRootCommentParams) => {
  return instance.get<CommonResponse<RootComments>>('/api/content/get-root-comment', params, { header: authHeader() })
}

/** 获取子评论 */
export const getSubComment = (params: GetSubCommentParams) => {
  return instance.get<CommonResponse<SubComments>>('/api/content/get-sub-comment', params, { header: authHeader() }     )
}

/** 删除评论 */
export const deleteComment = (comment_id: number) => {  
  return instance.del<CommonResponse<Record<string, never>>>('/api/content/delete-comment', { comment_id }, { header: authHeader() })
}

/** 收藏内容 */
export const collectContent = (params: ContentActionParams) => {
  return instance.post<CommonResponse<Record<string, never>>>('/api/content/collect', params, { header: authHeader() })
}

/** 点赞内容 */
export const likeContent = (params: ContentActionParams) => {
  return instance.post<CommonResponse<Record<string, never>>>('/api/content/like', params, { header: authHeader() })
}

/** 取消收藏 */
export const uncollectContent = (params: ContentActionParams) => {
  return instance.post<CommonResponse<Record<string, never>>>('/api/content/uncollect', params, { header: authHeader() })
}

/** 取消点赞 */
export const unlikeContent = (params: ContentActionParams) => {
  return instance.post<CommonResponse<Record<string, never>>>('/api/content/unlike', params, { header: authHeader() })
}

/** 获取最新文章 */
export const getNewArticles = (params: CursorPageParams) => {
  return instance.get<CommonResponse<ArticleList>>('/api/content/get-new-articles', params, { header: authHeader() })
}

/** 获取最新漫画 */
export const getNewComics = (params: CursorPageParams) => {
  return instance.get<CommonResponse<ComicList>>('/api/content/get-new-comics', params, { header: authHeader() })
}

/** 获取最新播客 */
export const getNewPodcastsList = (params: CursorPageParams) => {
  return instance.get<CommonResponse<PodcastList>>('/api/content/get-new-podcasts', params, { header: authHeader() }    )
}

/** 获取最新视频 */
export const getNewVideosList = (params: CursorPageParams) => {
  return instance.get<CommonResponse<VideoList>>('/api/content/get-new-videos', params, { header: authHeader() })
}
