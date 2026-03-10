import { useState } from 'react';
import Dialog from './components/dialog';
import BottomInput from './components/bottomInput';

// 消息数据类型
export interface Message {
    id: number;
    message: string;
    role: 'user' | 'assistant';
    time: string;
}

function Chat() {

    const [inputValue,setInputValue] = useState('');
    // 示例消息列表
    const [messages,setMessages] = useState<Message[]>([
        {
            id: 1,
            message: '你好，我是小安，很高兴认识你',
            role: 'assistant',
            time: '10:30',
        },
        {
            id: 2,
            message: '你好，我也很高兴认识你',
            role: 'user',
            time: '10:31',
        },
    ]);

    return (
        <div className="page-shell">
            <section className="page-hero">
                <span className="soft-tag">AI 对话</span>
                <h1 className="page-title" style={{ marginTop: '16px' }}>网页端对话工作台</h1>
                <p className="page-subtitle">保留现有消息结构和输入逻辑，把手机会话页改成适合桌面使用的聊天面板。</p>
            </section>

            <div className="page-content-grid">
                <aside className="page-side-column">
                    <div className="surface-card" style={{ padding: '22px' }}>
                        <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>当前会话</div>
                        <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#64748b' }}>
                            小安会根据你的提问给出建议与陪伴式回复，这里保留原有聊天数据结构，后续可直接接入新 API。
                        </div>
                    </div>
                </aside>

                <section
                    className="surface-card"
                    style={{
                        minHeight: '720px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div className="section-title">小安对话</div>
                            <div className="section-meta">网页化消息面板</div>
                        </div>
                        <span className="soft-tag">{messages.length} 条消息</span>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '20px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                        }}
                    >
                        {messages.map((msg) => (
                            <Dialog
                                key={msg.id}
                                message={msg.message}
                                role={msg.role}
                                time={msg.time}
                            />
                        ))}
                    </div>

                    <BottomInput messages={messages} inputValue={inputValue} setInputValue={setInputValue} setMessages={setMessages} />
                </section>
            </div>
        </div>
    );
}

export default Chat;    