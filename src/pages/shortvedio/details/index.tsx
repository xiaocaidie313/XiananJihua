import { Avatar } from "antd";
import {
    HeartFilled,
    MessageFilled,
    ShareAltOutlined,
    PlusOutlined,
    UserOutlined
} from "@ant-design/icons";
import image from '@/assets/images/carousel/01.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from "@/store/hooks";
import { getAllVedios, getVedioById } from "@/features/vedios/vediosSlice";
import { useState } from 'react';
import './index.css';
import CommentField from "@/components/commentfield";

function Vedios() {
    const navigate = useNavigate();
    const { id } = useParams();
    const vedio = useAppSelector(state => getVedioById(state, Number(id)));
    const allVedios = useAppSelector(getAllVedios);
    const [like, setLike] = useState(false);
    const [riseComment, setRiseComment] = useState(false);
    const recommendVedios = allVedios.filter(item => item.id !== Number(id)).slice(0, 5);

    if (!vedio) return <div style={{ color: '#334155', textAlign: 'center', paddingTop: '100px' }}>视频加载中...</div>;

    return (
        <div className="page-shell">
            <div className="yt-watch-layout">
                <section style={{ minWidth: 0 }}>
                    <div style={{
                        width: '100%',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        backgroundColor: '#020617',
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
                                maxHeight: '760px',
                                objectFit: 'contain',
                                backgroundColor: '#000',
                            }}
                        />
                    </div>

                    <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.35, color: '#0f0f0f' }}>{vedio.title}</div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '16px',
                            flexWrap: 'wrap',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Avatar
                                        size={46}
                                        icon={<UserOutlined />}
                                        style={{
                                            border: '2px solid white',
                                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        right: '-2px',
                                        backgroundColor: '#ff0033',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '11px',
                                    }}>
                                        <PlusOutlined />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f0f0f' }}>{vedio.author}</div>
                                    <div style={{ marginTop: '4px', fontSize: '13px', color: '#606060' }}>12.8万位订阅者</div>
                                </div>
                                <button
                                    style={{
                                        height: '36px',
                                        padding: '0 16px',
                                        border: 'none',
                                        borderRadius: '999px',
                                        background: '#0f0f0f',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                    }}
                                    type="button"
                                >
                                    订阅
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <button className="yt-watch-action" onClick={() => setLike(!like)} type="button">
                                    <HeartFilled className={`like-icon ${like ? 'like-icon-active' : ''}`} />
                                    <span>12.5w</span>
                                </button>
                                <button className="yt-watch-action" onClick={() => setRiseComment(true)} type="button">
                                    <MessageFilled />
                                    <span>8562</span>
                                </button>
                                <button className="yt-watch-action" type="button">
                                    <ShareAltOutlined />
                                    <span>分享</span>
                                </button>
                            </div>
                        </div>

                        <div
                            className="surface-card"
                            style={{
                                padding: '18px 20px',
                                background: '#f2f2f2',
                                borderColor: '#ebebeb',
                            }}
                        >
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f0f0f' }}>12万次观看 · 2 天前</div>
                            <div style={{ marginTop: '10px', fontSize: '14px', color: '#0f0f0f', lineHeight: 1.8 }}>
                                @{vedio.author} · #心理健康 #正能量 #缓解焦虑
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#606060' }}>原声 - {vedio.author} 的音乐花园</div>
                        </div>
                    </div>
                </section>

                <aside className="page-side-column">
                    <div className="surface-card" style={{ padding: '18px' }}>
                        <div className="section-title" style={{ fontSize: '18px', marginBottom: '14px' }}>接下来播放</div>
                        <div className="yt-side-list">
                            {recommendVedios.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(`/shortvideo/details/${item.id}`)}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        background: 'transparent',
                                        padding: 0,
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                    }}
                                    type="button"
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: '168px minmax(0, 1fr)', gap: '10px' }}>
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            style={{
                                                width: '168px',
                                                height: '94px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                            }}
                                        />
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f0f0f', lineHeight: 1.45 }}>{item.title}</div>
                                            <div style={{ marginTop: '6px', fontSize: '12px', color: '#606060' }}>{item.author}</div>
                                            <div style={{ marginTop: '4px', fontSize: '12px', color: '#606060' }}>推荐视频</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            <CommentField 
                visible={riseComment} 
                onClose={() => setRiseComment(false)} 
            />
        </div>
    );
}

export default Vedios;