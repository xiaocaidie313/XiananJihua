import { Carousel } from 'antd';
import Nav from '../../components/nav';
import NewsCardOutline from '../../components/newcardoutLine';
import Header from '@/components/header';
import { getSixNews } from '@/features/news/newsSlice';
import { useAppSelector } from '@/store/hooks';
import { getCarouselImages } from '@/features/carousel/carousleSlice';

function Home() {
    // ✅ 正确：直接将选择器函数传给 useAppSelector
    const sixNews = useAppSelector(getSixNews);
    const images = useAppSelector(getCarouselImages);
    
    return (
        <div className="w-full"
            style={{
                padding:'0 10px',
                paddingTop: '70px', // 为 fixed Header 留出空间
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'start',
                gap:'10px',
            }}
        >
            <Header />
            {/* 轮播图容器 */}
            <div className="w-full rounded-2xl" style={{ 
                height: '300px', 
                backgroundColor: '#f5f5f5', 
                overflow: 'hidden',
                position: 'relative' 
            }}>
                {!images || images.length === 0 ? (
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <p>轮播图数据加载中...</p>
                    </div>
                ) : (
                    <Carousel
                        key={images.length} // 确保数据回来后重装
                        autoplay
                        autoplaySpeed={3000}
                        draggable
                        infinite={images.length > 1}
                        // afterChange={handleChange}
                        style={{ width: '100%', height: '300px' }}
                    >
                        {images.map((image) => (
                            <div key={image.id}>
                                <div style={{
                                    height: '300px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#FFFFFF', // 设置白色背景，留白时更美观
                                    borderRadius: '16px',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={image.url}
                                        alt={`carousel ${image.id}`}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain', // 确保图片完整显示
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>
            <Nav />
            {sixNews.map((news, index) => (
                <NewsCardOutline 
                news={news}
                key={index} 
                                />
            ))}
        </div>
    );
}

export default Home;