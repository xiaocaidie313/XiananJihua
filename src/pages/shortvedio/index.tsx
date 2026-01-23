import Header from '../../components/header/index';
import VedioCardOutline from '../../components/vediocardoutline/index';
import Footer from '../../components/footer/index';
import { useAppSelector } from '@/store/hooks';
import { getAllVedios } from '@/features/vedios/vediosSlice';
import { useLocation, useNavigate, type Location} from 'react-router-dom';
import { useState, useEffect , useRef} from 'react';
import './index.css';
function ShortVideo() {
    const vedios = useAppSelector(getAllVedios);
    const navigate = useNavigate()
    const [isEntering, setIsEntering] = useState(true)
    const [isBack, setIsBack] = useState(false)
    const location = useLocation()
    const isFromDetails = (location.state as { fromDetails?: boolean })?.fromDetails
    const backgroundLocation = useRef<Location | null>((location.state as { backgroundLocation?: Location })?.backgroundLocation)
    const playEnterAnimation = () =>{
       setTimeout(() => {
            setIsEntering(false);
        }, 10);

    }
    useEffect(() => {   
        if(!isFromDetails){
            playEnterAnimation()
        }
    }, [isFromDetails]);

    const handleBack = () => {
        setIsBack(true)
        setTimeout(() => {
            navigate('/', { replace: true })
            setIsBack(false)
        }, 300)
    }

    return (
        <div 
            className={`shortvideo-container 
            ${isEntering ? 'is-entering' : ''} 
            ${isBack ? 'is-back' : ''}`}
            style={{
                position:'fixed',
                top:0,
                left:0,
                right:0,
                bottom:0,
                zIndex:5000,
                backgroundColor: '#f8f8f8',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Header handleBack={handleBack} />
            
            <div style={{
                flex: 1,
                width: '100%',
                overflowY: 'auto',
                padding: '70px 12px 100px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* 瀑布流布局 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    width: '100%',
                }}>
                    {vedios.map((vedio) => (
                        <VedioCardOutline 
                            key={vedio.id} 
                            vedio={vedio}
                        />
                    ))}
                </div>
            </div>
            
            {/* Footer 固定在底部 */}
            {/* <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 10
            }}>
                <Footer />
            </div> */}
        </div>
    );
}

export default ShortVideo;