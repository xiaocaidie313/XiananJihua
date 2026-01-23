import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';
import type { Vedio } from '@/features/vedios/vediosSlice';

function VedioCardOutLine({ vedio }: { vedio: Vedio }) {
    const { id, title, author, cover } = vedio;
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div
            onClick={() => navigate(`/shortvideo/details/${id}`, {
                // replace: true,
                state: {
                    backgroundLocation: location
                }
            })}
            style={{
                width: '100%',
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* 封面图区域 */}
            <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <img src={cover} alt={title} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }} />
                {/* 播放按钮叠加 */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '40px',
                    color: 'white',
                    opacity: 0.8,
                }}>
                    <PlayCircleOutlined />
                </div>
            </div>

            {/* 信息区域 */}
            <div style={{
                padding: '8px 10px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {title}
                </div>
                <div style={{
                    fontSize: '12px',
                    color: '#999',
                }}>
                    {author}
                </div>
            </div>
        </div>
    );
}

export default VedioCardOutLine;