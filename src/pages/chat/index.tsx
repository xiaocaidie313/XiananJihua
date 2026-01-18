import { useState } from 'react';
import Dialog from './components/dialog';
import BottomInput from './components/bottomInput';
import Header from './components/header';

// 消息数据类型
interface Message {
    id: number;
    message: string;
    role: 'user' | 'assistant';
    time: string;
}

function Chat() {
    // 示例消息列表
    const [messages] = useState<Message[]>([
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
        <div
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: 'white',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
            }}
        >
            <Header />
            
            {/* 消息列表区域 */}
            <div
                style={{
                    height: 'calc(100vh - 50px - 100px)', // Header 50px + BottomInput 100px
                    overflowY: 'auto',
                    paddingTop: '50px', // Header 高度
                    paddingBottom: '100px', // BottomInput 高度
                    display: 'flex',
                    flexDirection: 'column',
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
            
            <BottomInput />
        </div>
    );
}

export default Chat;    