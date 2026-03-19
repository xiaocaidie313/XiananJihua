import { Avatar } from "antd";
import {
    HeartFilled,
    HeartOutlined,
    ShareAltOutlined,
    PlusOutlined,
    UserOutlined
} from "@ant-design/icons";
import image from '@/assets/images/carousel/01.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { useVideo, useVideos } from '@/hooks/useVideos';
import { useCallback, useEffect, useState } from 'react';
import { likeContent, unlikeContent, getRootComment, addComment } from '@/api/content';
import { ContentType } from '@/pages/shortvedio';
import type { RootComment, RootComments } from '@/constants/content';
import type { ResponseComment } from '@/constants/content';
import { getCurrentUserId, getErrorMessage, getStoredUser, timestampToMs, unwrapResponse } from '@/utils/appState';
import './index.css';

function Vedios() {
    const navigate = useNavigate();
    const { id } = useParams();
    const videoId = id ? Number(id) : null;
    const { vedio } = useVideo(videoId);
    const { vedios: allVedios } = useVideos();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState<RootComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [publishLoading, setPublishLoading] = useState(false);
    const [actionFeedback, setActionFeedback] = useState('');
    const [videoError, setVideoError] = useState<string | null>(null);
    const currentUserId = getCurrentUserId();
    const recommendVedios = allVedios.filter(item => item.video_id !== videoId).slice(0, 5);

    const formatCommentTime = (ts: number) => {
        const ms = timestampToMs(ts);
        const d = new Date(ms);
        const now = Date.now();
        const diff = now - ms;
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
        if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`;
        return d.toLocaleDateString('zh-CN');
    };

    useEffect(() => {
        if (vedio) {
            setLikeCount(vedio.like_count ?? 0);
            setIsLiked(Boolean(vedio.is_liked ?? (vedio.relation_status != null && (vedio.relation_status & 1) === 1)));
        }
    }, [vedio]);

    const fetchComments = useCallback(async () => {
        if (!videoId) return;
        setCommentsLoading(true);
        try {
            const res = await getRootComment({
                content_type: ContentType.video,
                content_id: videoId,
                page: 1,
                page_size: 20,
            });
            const data = unwrapResponse(res) as RootComments | RootComment[];
            const list = Array.isArray(data) ? data : (data as RootComments)?.comments ?? [];
            setComments(list);
        } catch (err) {
            console.log(err);
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        if (videoId) void fetchComments();
    }, [videoId, fetchComments]);

    const handleLike = useCallback(async () => {
        if (!videoId) return;
        if (!currentUserId) {
            setActionFeedback('请先登录后再点赞');
            return;
        }
        try {
            if (isLiked) {
                await unlikeContent({ content_id: videoId, content_type: ContentType.video });
                setLikeCount((c) => Math.max(0, c - 1));
                setIsLiked(false);
            } else {
                await likeContent({ content_id: videoId, content_type: ContentType.video });
                setLikeCount((c) => c + 1);
                setIsLiked(true);
            }
            setActionFeedback('');
        } catch (e) {
            console.log(e);
            setActionFeedback(getErrorMessage(e, '点赞失败，请稍后重试'));
        }
    }, [videoId, isLiked, currentUserId]);

    const handlePublishComment = useCallback(async () => {
        if (!videoId || !commentInput.trim()) return;
        if (!currentUserId) {
            setActionFeedback('请先登录后再评论');
            return;
        }
        const user = getStoredUser();
        const text = commentInput.trim();
        setPublishLoading(true);
        setActionFeedback('');
        try {
            const res = await addComment({
                content_id: videoId,
                content_type: ContentType.video,
                comment_text: text,
                parent_id: 0,
                reply_comment_id: 0,
                reply_user_id: 0,
                status: 0,
                user_name: user?.name || '',
                avatar: user?.avatar || 'https://xiaoanv.oss-cn-beijing.aliyuncs.com/pics/avt.png',
            });
            setCommentInput('');
            const data = unwrapResponse(res) as ResponseComment;
            const newComment: RootComment = {
                id: data.comment_id,
                type: 'video',
                target_id: videoId,
                user_id: currentUserId,
                nickname: user?.name ?? '我',
                avatar: user?.avatar || 'https://xiaoanv.oss-cn-beijing.aliyuncs.com/pics/avt.png',
                ip_location: '',
                content: text,
                sub_comment_count: 0,
                created_at: Date.now(),
                updated_at: Date.now(),
            };
            setComments((prev) => [newComment, ...prev]);
        } catch (e) {
            console.log(e);
            setActionFeedback(getErrorMessage(e, '发布失败，请稍后重试'));
        } finally {
            setPublishLoading(false);
        }
    }, [videoId, commentInput, currentUserId]);

    const handleShare = useCallback(async () => {
        if (!videoId) return;
        const shareUrl = `${window.location.origin}/vedios/${videoId}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setActionFeedback('已复制链接');
            setTimeout(() => setActionFeedback(''), 1600);
        } catch (err) {
            console.log(err);
            window.prompt('复制链接', shareUrl);
        }
    }, [videoId]);

    if (!vedio) return <div style={{ color: '#334155', textAlign: 'center', paddingTop: '100px' }}>视频加载中...</div>;

    return (
        <div className="page-shell">
            <div className="yt-watch-layout">
                <section style={{ minWidth: 0 }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        aspectRatio: '16 / 9',
                        margin: '0 auto',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        backgroundColor: '#020617',
                        position: 'relative',
                    }}>
                        {videoError ? (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#94a3b8',
                                padding: '24px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '15px', marginBottom: '8px' }}>视频加载失败</div>
                                <div style={{ fontSize: '13px' }}>{videoError}</div>
                                <div style={{ fontSize: '12px', marginTop: '12px' }}>请确保视频为 MP4 格式（H.264 编码）</div>
                            </div>
                        ) : null}
                        <video
                            src={vedio.url}
                            controls
                            autoPlay
                            loop
                            playsInline
                            muted={false}
                            poster={vedio.cover || image}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                backgroundColor: '#000',
                            }}
                            onError={() => setVideoError('格式不支持或网络异常，请尝试使用 MP4 格式重新上传')}
                            onLoadedData={() => setVideoError(null)}
                        />
                    </div>

                    <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.35, color: '#0f0f0f' }}>{vedio.name}</div>

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
                                        src={'https://xiaoanv.oss-cn-beijing.aliyuncs.com/pics/avt.png'}
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
                                {actionFeedback ? (
                                    <div style={{ fontSize: '13px', color: actionFeedback.includes('已复制') ? '#22c55e' : '#ff4d67', marginRight: '4px' }}>{actionFeedback}</div>
                                ) : null}
                                <button
                                    className={`yt-watch-action yt-watch-action--like${isLiked ? ' is-liked' : ''}`}
                                    onClick={() => void handleLike()}
                                    type="button"
                                >
                                    {isLiked ? <HeartFilled /> : <HeartOutlined />}
                                    <span>{likeCount >= 10000 ? `${(likeCount / 10000).toFixed(1)}w` : likeCount}</span>
                                </button>
                                <button className="yt-watch-action" onClick={() => void handleShare()} type="button">
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
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f0f0f' }}>
                                {(vedio.view_count ?? 0).toLocaleString()}次观看
                                {vedio.published_at ? ` · ${formatCommentTime(vedio.published_at)}` : ''}
                            </div>
                            <div style={{ marginTop: '10px', fontSize: '14px', color: '#0f0f0f', lineHeight: 1.8 }}>
                                @{vedio.author} · #心理健康 #正能量 #缓解焦虑
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#606060' }}>原声 - {vedio.author} 的音乐花园</div>
                        </div>

                        <div className="surface-card" style={{ padding: '20px', marginTop: '20px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f0f0f', marginBottom: '16px' }}>{Math.max(comments.length, vedio?.comment_count ?? 0)} 条评论</div>
                            {actionFeedback ? <div style={{ marginBottom: '12px', fontSize: '13px', color: '#ff4d67' }}>{actionFeedback}</div> : null}
                            {actionFeedback ? <div style={{ marginBottom: '12px', fontSize: '13px', color: actionFeedback.includes('已复制') ? '#22c55e' : '#ff4d67' }}>{actionFeedback}</div> : null}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {commentsLoading ? (
                                    <div style={{ padding: '24px', textAlign: 'center', color: '#909090' }}>加载中...</div>
                                ) : comments.length === 0 ? (
                                    <div style={{ padding: '24px', textAlign: 'center', color: '#909090' }}>暂无评论，快来抢沙发吧</div>
                                ) : (
                                    comments.map((item) => {
                                        const name = (item as RootComment & { user_name?: string }).nickname ?? (item as RootComment & { user_name?: string }).user_name ?? '用户';
                                        const text = (item as RootComment & { comment_text?: string }).content ?? (item as RootComment & { comment_text?: string }).comment_text ?? '';
                                        const ts = (item as RootComment & { create_time?: number }).created_at ?? (item as RootComment & { create_time?: number }).create_time ?? 0;
                                        return (
                                            <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
                                                <Avatar
                                                    src={item.avatar}
                                                    icon={!item.avatar ? <UserOutlined /> : undefined}
                                                    size={32}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', color: '#606060', marginBottom: '4px' }}>
                                                        {name} · {formatCommentTime(ts)}
                                                    </div>
                                                    <div style={{ fontSize: '15px', color: '#0f0f0f', lineHeight: 1.5 }}>{text}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #ebebeb' }}>
                                <input
                                    placeholder="善语结善缘，恶言伤人心"
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && void handlePublishComment()}
                                    style={{
                                        flex: 1,
                                        height: '40px',
                                        background: '#f5f5f5',
                                        borderRadius: '20px',
                                        border: 'none',
                                        padding: '0 16px',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                                <span
                                    style={{
                                        color: publishLoading || !commentInput.trim() ? '#ccc' : '#FF2C55',
                                        fontWeight: 600,
                                        cursor: publishLoading || !commentInput.trim() ? 'not-allowed' : 'pointer',
                                    }}
                                    onClick={() => !publishLoading && commentInput.trim() && void handlePublishComment()}
                                >
                                    {publishLoading ? '发布中...' : '发布'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="page-side-column">
                    <div className="surface-card" style={{ padding: '18px' }}>
                        <div className="section-title" style={{ fontSize: '18px', marginBottom: '14px' }}>接下来播放</div>
                        <div className="yt-side-list">
                            {recommendVedios.map((item) => (
                                <button
                                    key={item.video_id}
                                    onClick={() => item.video_id != null && navigate(`/vedios/${item.video_id}`)}
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
                                            alt={item.name ?? ''}
                                            style={{
                                                width: '168px',
                                                height: '94px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                            }}
                                        />
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f0f0f', lineHeight: 1.45 }}>{item.name ?? ''}</div>
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
        </div>
    );
}

export default Vedios;