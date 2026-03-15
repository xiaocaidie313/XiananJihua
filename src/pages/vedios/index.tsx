import { useAppSelector } from '@/store/hooks'
import { getAllVedios } from '@/features/vedios/vediosSlice'
import VedioCardOutline from '@/components/vediocardoutline'
import './index.css'

function VediosList() {
  const vedios = useAppSelector(getAllVedios)

  if (!vedios.length) {
    return (
      <div className="page-shell vedios-page">
        <div style={{ color: '#334155', textAlign: 'center', paddingTop: '100px' }}>
          暂无视频内容
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell vedios-page">
      <section className="surface-card" style={{ padding: '28px', width: '100%', maxWidth: '100%' }}>
        <div className="section-head">
          {/* <div>
            <div className="section-title">长视频</div>
          </div> */}
        </div>
        <div className="vedios-grid">
          {vedios.map((vedio) => (
            <VedioCardOutline key={vedio.id} vedio={vedio} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default VediosList
