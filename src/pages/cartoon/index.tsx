import { Carousel } from 'antd';
import Nav from '../../components/nav';
import NewsCardOutline from '../../components/newcardoutLine';
import Header from '@/components/header';
import { getSixNews } from '@/features/news/newsSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getCarouselImages, setCurrentIndex } from '@/features/carousel/carousleSlice';
import { useLocation, useNavigate} from 'react-router-dom';
import {useState, useEffect } from 'react';
import './index.css';

function Cartoon() {
    const images = useAppSelector(getCarouselImages);
    const sixNews = useAppSelector(getSixNews);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [isEntering, setIsEntering] = useState(true)
    const [isBack, setIsBack] = useState(false);
    const navigate = useNavigate();

    const handleChange = (index: number) => {
        dispatch(setCurrentIndex(index));
    };

    const handleBack = () =>{
        setIsBack(true)
        setTimeout(()=>{
            navigate(-1)
            setIsBack(false)

        },300)
    }

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setIsEntering(false)
        },10)
        return () => clearTimeout(timer);
    },[])

    return (
        <div className={`cartoon-page 
        ${isBack ? 'click-back' : ''}
        ${isEntering ? 'is-entering' : ''}
        `}
            style={{
                position:'fixed',
                top:0,
                left:0,
                right:0,
                bottom:0,
                zIndex:5000,
                backgroundColor:'white',
                display:'flex',
                flexDirection:'column',
                overflow:'hidden',
            }}
        >
            <Header handleBack={handleBack} />
            
            <div style={{
                flex: 1,
                width: '100%',
                overflowY: 'auto',
                padding: '0 10px',
                paddingTop: '70px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
            }}>
                {/* 轮播图容器 */}
                <div className="w-full rounded-2xl" style={{ 
                    height: '300px', 
                    backgroundColor: '#f5f5f5', 
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0
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
                            key={images.length}
                            autoplay
                            autoplaySpeed={3000}
                            afterChange={handleChange}
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
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '16px',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={image.url}
                                            alt={`carousel ${image.id}`}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    )}
                </div>

                <div className="w-full"
                    style={{
                        display:'flex',
                        flexWrap:'wrap',
                        alignItems:'center',
                        justifyContent:'start',
                        gap:'10px',
                        width:'100%',
                        paddingBottom: '20px'
                    }}
                >
                    {sixNews.map((news) => (
                        <NewsCardOutline key={news.id} news={news} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Cartoon;