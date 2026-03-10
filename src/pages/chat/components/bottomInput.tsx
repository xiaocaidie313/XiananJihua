import { SendIcon } from "@/components/icon";
import type { Message } from "@/pages/chat/index";

function BottomInput({ inputValue, messages, setInputValue, setMessages }: {
    inputValue: string, messages: Message[],
    setInputValue: (value: string) => void, setMessages: (messages: Message[]) => void
}) {
    const handleSend = () => {
        if (!inputValue.trim()) {
            return;
        }
        console.log(inputValue);
        setInputValue('');
        setMessages([...messages, {
            id: messages.length + 1,
            message: inputValue,
            role: 'user',
            time: new Date().toLocaleString(),
        }]);
    }
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '18px 24px 24px',
            borderTop: '1px solid #eef2f7',
            backgroundColor: '#fff',
        }}>
            <div className="input-wrapper"
                style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '18px',
                    border: '1px solid #e5e7eb',
                }}
            >
                <input type="text" placeholder="输入你想聊的话题..." style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    padding: '0 10px',
                    backgroundColor: 'transparent',
                }} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                />
                <SendIcon onClick={handleSend} />
            </div>
        </div>
    )
}

export default BottomInput;