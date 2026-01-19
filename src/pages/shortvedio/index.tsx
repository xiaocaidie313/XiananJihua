import Header from '../../components/header/index';
import VedioCardOutline from '../../components/vediocardoutline/index';
import Footer from '../../components/footer/index';
import { useAppSelector } from '@/store/hooks';
import { getAllVedios } from '@/features/vedios/vediosSlice';

function ShortVideo() {
    const vedios = useAppSelector(getAllVedios);

    return (
        <>
            <Header />
            <div style={{
                width: '100%',
                padding: '70px 12px 20px 12px', 
                backgroundColor: '#f8f8f8',
                minHeight: '100vh',
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
            <Footer />
        </>
    );
}

export default ShortVideo;