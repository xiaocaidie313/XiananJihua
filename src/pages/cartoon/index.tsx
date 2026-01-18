import Header from '../../components/header/index';
import { Carousel } from 'antd';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCurrentIndex } from '../../features/carousel/carousleSlice';
import image01 from '@/assets/images/carousel/01.jpg';
import NewsCardOutline from '@/components/newcardoutLine';
function Cartoon() {
    const images = useAppSelector((state) => state.carousel.images);
    const currentIndex = useAppSelector((state) => state.carousel.currentIndex);
    const dispatch = useAppDispatch();
    const handleChange = (index: number) => {
        dispatch(setCurrentIndex(index));
    };
    return (
        <>
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
            {/* 轮播图 */}
            <div className="w-full rounded-2xl">
                {/* 如果 images 为空或未定义，显示提示 */}
                {!images || images.length === 0 ? (
                    <div style={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '16px'
                    }}>
                        <p>轮播图数据加载中...</p>
                    </div>
                ) : (
                    <Carousel
                        className='rounded-2xl'
                        style={{
                            width: '100%',
                            height: 'auto',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            
                        }}
                        autoplay
                        arrows={true}
                        infinite={true}
                        // dots={true}
                        // autoplaySpeed={3000}
                        afterChange={handleChange} // 当图片切换时调用
                    >
                        {/* 步骤 6: 使用 Redux 中的 images 数据来渲染 */}
                        {images.map((image) => (
                            <div key={image.id}>
                                <img
                                    src={image.url}
                                    alt={`carousel ${image.id}`}
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        objectFit: 'contain',
                                    }}
                                    onError={(e) => {
                                        // console.error('图片加载失败:', image.url);
                                        // 如果图片加载失败，可以显示占位图
                                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                                    }}
                                />
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>
            {/* 漫画 */}
            <div className="w-full"
            style={{
                display:'flex',
                flexWrap:'wrap',
                alignItems:'center',
                justifyContent:'start',
                gap:'10px',
                width:'100%',
            }}
            >

            {Array.from({length: 6}).map((_, index) => (
                <NewsCardOutline key={index} image={image01} text={'我是text'} />
            ))}

            </div>
        </div>
        </>
    )
}
export default Cartoon;