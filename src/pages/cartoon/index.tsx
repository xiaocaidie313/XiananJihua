import { Carousel } from 'antd';
import NewsCardOutline from '../../components/newcardoutLine';
import { getSixNews } from '@/features/news/newsSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getCarouselImages, setCurrentIndex } from '@/features/carousel/carousleSlice';
import { useEffect } from 'react';
import './index.css';

function Cartoon() {
  const images = useAppSelector(getCarouselImages);
  const sixNews = useAppSelector(getSixNews);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentIndex(0));
  }, [dispatch]);

  const handleChange = (index: number) => {
    dispatch(setCurrentIndex(index));
  };

  return (
    <div className="page-shell cartoon-page">
      <section className="page-hero">
        <span className="soft-tag">条漫频道</span>
        <h1 className="page-title" style={{ marginTop: '16px' }}>
          图文内容更适合网页浏览
        </h1>
        <p className="page-subtitle">
          保留原有频道和推荐内容，使用宽屏头图、卡片流和更舒展的桌面端信息密度来增强阅读体验。
        </p>
      </section>

      <div className="cartoon-layout">
        <section className="surface-card" style={{ padding: '24px' }}>
          <div className="section-head">
            <div>
              <div className="section-title">精选条漫</div>
              <div className="section-meta">使用横向头图承载推荐内容</div>
            </div>
          </div>

          <div className="cartoon-carousel">
            {!images || images.length === 0 ? (
              <div className="cartoon-carousel__placeholder">轮播图数据加载中...</div>
            ) : (
              <Carousel autoplay autoplaySpeed={3000} afterChange={handleChange} style={{ width: '100%', height: '100%' }}>
                {images.map((image) => (
                  <div key={image.id}>
                    <div className="cartoon-carousel__item">
                      <img src={image.url} alt={`carousel ${image.id}`} className="cartoon-carousel__image" />
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </section>

        <aside className="surface-card" style={{ padding: '22px' }}>
          <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
            漫画导览
          </div>
          <div className="info-stack">
            <div style={{ padding: '14px 16px', borderRadius: '18px', background: '#f8fafc' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>内容阅读更舒展</div>
              <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: 1.6, color: '#64748b' }}>
                改成网页频道页后，条漫内容不再以滑入层展示，而是作为常规频道浏览。
              </div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: '18px', background: '#f8fafc' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>推荐流更像资讯平台</div>
              <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: 1.6, color: '#64748b' }}>
                推荐卡片延续现有结构，但通过网页容器、间距和分区重新组织。
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="surface-card" style={{ padding: '24px' }}>
        <div className="section-head">
          <div>
            <div className="section-title">相关推荐</div>
            <div className="section-meta">继续复用原有资讯卡片组件</div>
          </div>
        </div>
        <div className="feed-list">
          {sixNews.map((news) => (
            <NewsCardOutline key={news.id} news={news} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Cartoon;