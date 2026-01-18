interface DialogProps {
  message: string;
  role: "user" | "assistant";
  time?: string;
}
function Dialog(props: DialogProps) {
  const { message, role, time } = props;
  const isOwn = role === "user"; // 判断是否是自己发送的消息

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        padding: "0 16px",
      }}
    >
        <div style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            width:'100%',
            padding:'0 16px',
        }}>  
                  {/* 时间 */}
      {time && (
        <span
          style={{
            fontSize: "12px",
            color: "#999",
            marginBottom: "4px",
          }}
        >
          {time}
        </span>
      )} </div>
      <div
        className={`message ${isOwn ? "message-own" : "message-other"}`}
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          marginBottom: "12px",
          justifyContent: isOwn ? "flex-end" : "flex-start",
          width: "100%",
          padding: "0 16px",
        }}
      >
        {/* 消息气泡 */}
        <div
          style={{
            maxWidth: "70%",
            padding: "10px 14px",
            borderRadius: "16px",
            wordWrap: "break-word",
            backgroundColor: isOwn ? "#5C4599" : "#F0EDF0",
            color: isOwn ? "white" : "#333",
            borderBottomRightRadius: isOwn ? "4px" : "16px",
            borderBottomLeftRadius: isOwn ? "16px" : "4px",
          }}
        >
          <span style={{ fontSize: "14px", lineHeight: "1.5" }}>{message}</span>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
