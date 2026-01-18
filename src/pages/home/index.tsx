import { Carousel } from 'antd';
// 步骤 1: 导入 Redux hooks
import { useAppSelector, useAppDispatch } from '../../store/hooks';
// 步骤 2: 导入 actions（用于修改状态）
import { setCurrentIndex } from '../../features/carousel/carousleSlice';
import Nav from '../../components/nav';
import NewsCardOutline from '../../components/newcardoutLine';
import image01 from '@/assets/images/carousel/01.jpg';
import Header from '@/components/header';
function Home() {
    // 步骤 3: 使用 useAppSelector 获取 Redux 中的状态
    // 这里获取 carousel 状态中的 images 数组
    const images = useAppSelector((state) => state.carousel.images);
    const currentIndex = useAppSelector((state) => state.carousel.currentIndex);
    
    // 步骤 4: 使用 useAppDispatch 获取 dispatch 函数
    // dispatch 用于调用 actions 来修改状态
    const dispatch = useAppDispatch();

    // 步骤 5: 当轮播图切换时，更新 Redux 中的当前索引
    const handleChange = (index: number) => {
        dispatch(setCurrentIndex(index));
    };


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
            <Nav />
            {Array.from({length: 6}).map((_, index) => (
                <NewsCardOutline key={index} image={image01} text={'我是text'} />
            ))}
        </div>
    );
}

export default Home;