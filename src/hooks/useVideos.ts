import { useCallback, useEffect, useState } from 'react'
import { getNewVideosList, getVideoContent } from '@/api/content'
import type { VideoItem } from '@/api/content/types'
import { readHomeVideosCache, writeHomeVideosCache } from '@/utils/homeFeedCache'

/** 从接口获取视频列表；session 用于失败兜底与离线感，列表展示仍以首次请求为准避免缓存→接口突变 */
export function useVideos() {
  const initial = readHomeVideosCache()
  const [vedios, setVedios] = useState<VideoItem[]>(() => initial)
  const [loading, setLoading] = useState(() => initial.length === 0)
  /** 当前挂载实例上，第一次列表请求结束前为 true——用于骨架屏（与缓存是否存在无关） */
  const [initialPending, setInitialPending] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    return getNewVideosList({ page_size: 50, cursor: 0 })
      .then((res: { data?: { videos?: VideoItem[] } }) => {
        const videos = res?.data?.videos ?? []
        setVedios(videos)
        writeHomeVideosCache(videos)
      })
      .catch((e) => {
        console.log(e)
        setError(e?.message ?? '获取视频失败')
      })
  }, [])

  useEffect(() => {
    let active = true
    refetch().finally(() => {
      if (active) {
        setLoading(false)
        setInitialPending(false)
      }
    })
    return () => {
      active = false
    }
  }, [refetch])

  return { vedios, loading, initialPending, error, refetch }
}

/** 从接口获取单个视频详情 */
export function useVideo(id: number | null) {
  const [vedio, setVedio] = useState<VideoItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id == null) {
      queueMicrotask(() => {
        setVedio(null)
        setLoading(false)
      })
      return
    }
    queueMicrotask(() => setVedio(null))
    let active = true
    getVideoContent(id)
      .then((res: { data?: { video?: VideoItem } }) => {
        const v = res?.data?.video
        if (active && v) setVedio(v)
      })
      .catch((e) => {
        console.log(e)
        if (active) setError(e?.message ?? '获取视频失败')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [id])

  return { vedio, loading, error }
}
