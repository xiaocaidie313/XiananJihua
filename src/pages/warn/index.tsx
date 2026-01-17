import { Button } from "antd";

function Warn() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)", // 减去 footer 的高度和 padding
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        gap: "20px",
        justifyContent: "space-between",
      }}
    >
      {/* 第一部分：标题 */}
      <div
        className="text-2xl"
        style={{
          width: "100%",
          flex: "0 0 auto", // 不伸缩，保持内容高度
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>遇到紧急情况，请放心求助</span>
      </div>

      {/* 第二部分：按钮 */}
      {/* <Button
        color="purple"
        variant="solid"
        shape="circle"
        style={{
          width: "200px",
          height: "200px",
          flex: "0 0 auto", // 不伸缩，保持固定大小
        }}
      >
        Solid
      </Button> */}
      <div className="lightpurple"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        //   width: "100%",
            width:'250px',
          height: "250px",
          flex: "0 0 auto", // 不伸缩，保持固定大小
        
          borderRadius: "50%",
        }}
      >
        <span className="text-3xl">一键报警</span>
      </div>

      {/* 第三部分：三个操作按钮 */}
      <div
      className="lightpurple"
        style={{
          width: "100%",
          //   flex: "1 1 auto", // 占据剩余空间
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        //   backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          gap: "10px",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            flex: "1 1 0", // 平均分配空间
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <span>打开位置共享</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            flex: "1 1 0", // 平均分配空间
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <span>拨打家长电话</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            flex: "1 1 0", // 平均分配空间
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <span>12355直联</span>
        </div>
      </div>
    </div>
  );
}

export default Warn;
