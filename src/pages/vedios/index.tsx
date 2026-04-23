import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useVideos } from '@/hooks/useVideos'
import VedioCardOutline from '@/components/vediocardoutline'
import './index.css'

function VediosList() {
  const { vedios, loading, refetch } = useVideos()
  const location = useLocation()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if ((location.state as { fromUpload?: boolean })?.fromUpload) {
      queueMicrotask(() => setRefreshing(true))
      refetch().finally(() => setRefreshing(false))
    }
  }, [location.state, refetch])

  const handleRefresh = () => {
    setRefreshing(true)
    refetch().finally(() => setRefreshing(false))
  }

  if (!vedios.length && !loading) {
    return (
      <div className="page-shell vedios-page">
        <div style={{ color: '#334155', textAlign: 'center', paddingTop: '100px' }}>
          暂无视频内容
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>
            刷新
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell vedios-page">
      <section className="surface-card" style={{ padding: '28px', width: '100%', maxWidth: '100%' }}>
        <div className="section-head" style={{ justifyContent: 'flex-end' }}>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing} size="small">
            刷新
          </Button>
        </div>
        <div className="vedios-grid">
          {vedios.map((vedio, index) => (
            <VedioCardOutline key={vedio.video_id ?? index} vedio={vedio} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default VediosList
