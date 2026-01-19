import Header from "@/components/header";
import { Avatar } from "antd";
import { 
    HeartFilled, 
    MessageFilled, 
    ShareAltOutlined, 
    PlusOutlined,
    UserOutlined 
} from "@ant-design/icons";
import image from '@/assets/images/carousel/01.jpg';
import { useParams } from 'react-router-dom';
import { useAppSelector } from "@/store/hooks";
import { getVedioById } from "@/features/vedios/vediosSlice";

function Vedios() {
    const { id } = useParams();
    const vedio = useAppSelector(state => getVedioById(state, Number(id)));

    if (!vedio) return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>视频加载中...</div>;

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#000',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Header />

            {/* 视频播放区域 (这里用图片模拟视频) */}
            <div style={{
                flex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                <video
                    src={vedio.url}
                    controls
                    autoPlay
                    loop
                    playsInline
                    poster={vedio.cover || image}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#000',
                    }}
                />

                {/* 底部渐变遮罩 */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '30%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    pointerEvents: 'none',
                }} />

                {/* 右侧交互按钮栏 */}
                <div style={{
                    position: 'absolute',
                    right: '12px',
                    bottom: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '25px',
                    zIndex: 10,
                }}>
                    {/* 头像 */}
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <Avatar 
                            size={50}
                            icon={<UserOutlined />} 
                            style={{ 
                                backgroundColor: '',
                                border: '2px solid white' }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#FF2C55',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                        }}>
                            <PlusOutlined />
                        </div>
                    </div>

                    {/* 点赞 */}
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <HeartFilled style={{ fontSize: '35px', color: '#FF2C55' }} />
                        <div style={{ fontSize: '12px', marginTop: '5px' }}>12.5w</div>
                    </div>

                    {/* 评论 */}
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <MessageFilled style={{ fontSize: '35px' }} />
                        <div style={{ fontSize: '12px', marginTop: '5px' }}>8562</div>
                    </div>

                    {/* 分享 */}
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <ShareAltOutlined style={{ fontSize: '35px' }} />
                        <div style={{ fontSize: '12px', marginTop: '5px' }}>2.3w</div>
                    </div>
                </div>

                {/* 左下角信息区 */}
                <div style={{
                    position: 'absolute',
                    left: '16px',
                    bottom: '40px',
                    color: 'white',
                    maxWidth: '70%',
                    zIndex: 10,
                }}>
                    <div style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        marginBottom: '8px' 
                    }}>
                        @{vedio.author}
                    </div>
                    <div style={{ 
                        fontSize: '15px', 
                        lineHeight: '1.4',
                        marginBottom: '10px'
                    }}>
                        {vedio.title} #心理健康 #正能量 #缓解焦虑
                    </div>
                    <div style={{ 
                        fontSize: '13px', 
                        display: 'flex', 
                        alignItems: 'center',
                        opacity: 0.8
                    }}>
                        <span style={{ marginRight: '10px' }}>🎵 原声 - {vedio.author}的音乐花园</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Vedios;