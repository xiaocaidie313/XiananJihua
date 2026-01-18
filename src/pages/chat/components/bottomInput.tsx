import { SendIcon } from "@/components/icon";

function BottomInput(){
    return (
        <>
            <div style={{
                width:'100%',
                height:'100px',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                backgroundColor:'white',
                position:'fixed',
                bottom:'0',
                left:'0',
                right:'0',
                zIndex:1000,
                padding:'10px 16px',

            }}>
                <div className="input-wrapper"
                    style={{
                        display:'flex',
                        width:'100%',
                        alignItems:'center',
                        justifyContent:'space-between',
                        backgroundColor:'white',
                        padding:'10px 12px',
                        borderRadius:'10px',
                        border:'1px solid #e5e5e5',
                        boxShadow:'0 0 10px 0 rgba(0,0,0,0.1)',
                    }}
                >
                <input type="text" placeholder="请输入内容" style={{
                    width:'100%',
                    height:'100%',
                    border:'none',
                    outline:'none',
                    fontSize:'14px',
                    padding:'0 10px',
                }} />
                <SendIcon />
                </div>
                </div>
        </>
    )
}

export default BottomInput;