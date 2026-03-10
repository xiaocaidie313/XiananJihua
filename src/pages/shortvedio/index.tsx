import VedioCardOutline from '../../components/vediocardoutline/index';
import { useAppSelector } from '@/store/hooks';
import { getAllVedios } from '@/features/vedios/vediosSlice';
import './index.css';

function ShortVideo() {
  const vedios = useAppSelector(getAllVedios);
  const filters = ['全部', '最新上传', '学习成长', '安全守护', '正能量', '心理调节'];

  return (
    <div className="page-shell shortvideo-page">
      <div className="yt-filter-row">
        {filters.map((item, index) => (
          <button key={item} className={`yt-filter-chip${index === 0 ? ' is-active' : ''}`} type="button">
            {item}
          </button>
        ))}
      </div>

      <section className="surface-card" style={{ padding: '20px' }}>
        <div className="section-head">
          <div>
            <div className="section-title">推荐内容</div>
            <div className="section-meta">采用 YouTube 风格的视频卡片流与筛选标签</div>
          </div>
          <span className="soft-tag">{vedios.length} videos</span>
        </div>

        <div className="yt-video-grid">
          {vedios.map((vedio) => (
            <VedioCardOutline key={vedio.id} vedio={vedio} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ShortVideo;