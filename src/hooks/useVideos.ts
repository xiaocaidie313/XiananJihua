import { useCallback, useEffect, useState } from 'react'
import { getNewVideosList, getVideoContent } from '@/api/content'
import type { VideoItem } from '@/api/content/types'

/** 从接口获取视频列表 */
export function useVideos() {
  const [vedios, setVedios] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    return getNewVideosList({ page_size: 50, cursor: 0 })
      .then((res: { data?: { videos?: VideoItem[] } }) => {
        const videos = res?.data?.videos ?? []
        setVedios(videos)
      })
      .catch((e) => {
        console.log(e)
        setError(e?.message ?? '获取视频失败')
      })
  }, [])

  useEffect(() => {
    let active = true
    refetch()
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [refetch])

  return { vedios, loading, error, refetch }
}

/** 从接口获取单个视频详情 */
export function useVideo(id: number | null) {
  const [vedio, setVedio] = useState<VideoItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id == null) {
      setVedio(null)
      setLoading(false)
      return
    }
    setVedio(null)
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
