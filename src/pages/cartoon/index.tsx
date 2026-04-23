import { Carousel } from 'antd'
import { useEffect, useMemo } from 'react'
import NewsCardOutline from '../../components/newcardoutLine'
import { getSixNews } from '@/features/news/newsSlice'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { getCarouselImages, setCurrentIndex } from '@/features/carousel/carousleSlice'
import { FeaturedCarouselSkeleton } from '@/pages/home/HomeSkeletons'
import './index.css'

function Cartoon() {
  const images = useAppSelector(getCarouselImages)
  const sixNews = useAppSelector(getSixNews)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setCurrentIndex(0))
  }, [dispatch])

  const articleItems = useMemo(() => {
    return sixNews.map((news) => ({
      id: news.id,
      title: news.title,
      cover: news.cover,
      author: news.author,
      description: '小安文章频道 · 点击查看详情与正文内容',
      meta: `${news.time.year}-${String(news.time.month).padStart(2, '0')}-${String(news.time.day).padStart(2, '0')}`,
    }))
  }, [sixNews])

  const handleChange = (index: number) => {
    dispatch(setCurrentIndex(index))
  }

  return (
    <div className="page-shell cartoon-page">
      <section className="page-hero">
        <span className="soft-tag">条漫频道</span>
        {/* <h1 className="page-title" style={{ marginTop: '16px' }}>
          图文内容更适合网页浏览
        </h1> */}
      </section>

      <div className="cartoon-layout">
        <section className="surface-card" style={{ padding: '24px' }}>
          <div className="section-head">
            <div>
              <div className="section-title">精选条漫</div>
            </div>
          </div>

          <div className="cartoon-carousel">
            {!images || images.length === 0 ? (
              <FeaturedCarouselSkeleton />
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

      </div>

      <section className="surface-card" style={{ padding: '24px' }}>
        <div className="section-head">
          <div>
            <div className="section-title">相关推荐</div>
          </div>
        </div>
        <div className="feed-list">
          {articleItems.map((item) => (
            <NewsCardOutline key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Cartoon