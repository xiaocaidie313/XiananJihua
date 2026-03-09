import { Avatar } from "antd";
import { UserOutlined, HeartFilled } from "@ant-design/icons";
import "./index.css";
import { useState } from "react";

interface CommentFieldProps {
    visible: boolean;
    onClose: () => void;
}

function CommentField({ visible, onClose }: CommentFieldProps) {
    const [like, setLike] = useState(false);    
    return (
        <>
            {/* 遮罩层 */}
            {visible && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent',
                        zIndex: 6999
                    }}
                    onClick={onClose}
                />
            )}

            {/* 评论区面板 */}
            <div className={`comment-container ${visible ? 'rise-comment' : ''}`}>
                <div className="comment-header">
                    8562 条评论
                    <div 
                        style={{ 
                            position: 'absolute', 
                            right: '16px', 
                            top: '16px', 
                            cursor: 'pointer', 
                            fontSize: '18px', 
                            color: '#999' 
                        }}
                        onClick={onClose}
                    >✕</div>
                </div>
                
                <div className="comment-list">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                        <div className="comment-item" key={item}>
                            <Avatar icon={<UserOutlined />} size={32} />
                            <div className="comment-content">
                                <div className="comment-user">用户 {item}</div>
                                <div className="comment-text">这是第 {item} 条评论的内容，感觉这个视频非常有意义！</div>
                            </div>
                            <HeartFilled className={`like-icon ${like ? 'like-icon-active' : ''}`} onClick={() => setLike(!like)} style={{ fontSize: '14px', color: '#ccc' }} />
                        </div>
                    ))}
                </div>

                <div className="comment-input-area">
                    <input className="comment-input" placeholder="善语结善缘，恶言伤人心" />
                    <div style={{ color: '#FF2C55', fontWeight: 'bold', cursor: 'pointer' }}>发布</div>
                </div>
            </div>
        </>
    );
}

export default CommentField;
