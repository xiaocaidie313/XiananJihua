import { Button, Avatar } from "antd";
import { 
    PhoneOutlined, 
    EnvironmentOutlined, 
    CustomerServiceOutlined,
    AlertOutlined,
    RightOutlined
} from "@ant-design/icons";
import Header from "@/components/header";

function Warn() {
  function call12355(){
    window.location.href = 'tel:12355';
  }
  function callParent(){
    window.location.href = 'tel:1234567890';
  }
  function call110(){
    window.location.href = 'tel:110';
  }
  return (
    <>
      {/* <Header /> */}
      <div
        style={{
          width: "100%",
          height: "100vh", // 占满整个视口
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "20px 24px 100px 24px", // 底部留 100px 避开 Footer
          backgroundColor: "#fcfaff",
          overflow: "hidden",
        }}
      >
        {/* 顶部提示 */}
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "6px" }}>
            遇到紧急情况？
          </h2>
          <p style={{ fontSize: "13px", color: "#999" }}>
            小安时刻守护你的安全，请点击下方按钮求助
          </p>
        </div>

        {/* 核心报警按钮 */}
        <div 
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '240px',
            height: '240px',
          }}
        >
          {/* 外圈装饰扩散效果 (模拟) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'rgba(92, 69, 153, 0.05)',
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            backgroundColor: 'rgba(92, 69, 153, 0.1)',
            zIndex: 1
          }}></div>

          <div 
            onClick={()=>call110()}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #944A94 0%, #5C4599 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 10px 30px rgba(92, 69, 153, 0.4)",
              cursor: "pointer",
              zIndex: 2,
              transition: 'transform 0.2s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <AlertOutlined style={{ fontSize: "36px", marginBottom: "10px" }} />
            <span style={{ fontSize: "22px", fontWeight: "bold", letterSpacing: '2px' }}>一键报警</span>
          </div>
        </div>

        {/* 辅助功能卡片组 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px", // 减少gap
            flexShrink: 0, // 防止被压缩
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 16px", // 减少padding
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              backgroundColor: '#f0eeff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <EnvironmentOutlined style={{ fontSize: '20px', color: '#5C4599' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>位置共享</div>
              <div style={{ fontSize: '11px', color: '#999' }}>实时同步位置给紧急联系人</div>
            </div>
            <RightOutlined style={{ color: '#ccc', fontSize: '12px' }} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 16px",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              backgroundColor: '#fff0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <PhoneOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>拨打家长电话</div>
              <div style={{ fontSize: '11px', color: '#999' }}>一键呼叫默认紧急联系人</div>
            </div>
            <RightOutlined style={{ color: '#ccc', fontSize: '12px' }} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 16px",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              backgroundColor: '#f0faff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <CustomerServiceOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            </div>
            <div 
            
            onClick={()=>call12355()}
            style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>12355青少年服务</div>
              <div style={{ fontSize: '11px', color: '#999' }}>专业青少年心理与维权咨询</div>
            </div>
            <RightOutlined style={{ color: '#ccc', fontSize: '12px' }} />
          </div>
        </div>

        {/* 安全提示 */}
        <div style={{ textAlign: 'center', padding: '0 20px', flexShrink: 0 }}>
          <p style={{ fontSize: '11px', color: '#ccc', lineHeight: '1.5' }}>
            提示：非紧急情况请勿随意点击报警按钮
          </p>
        </div>
      </div>
    </>
  );
}

export default Warn;
