import { 
    PhoneOutlined, 
    EnvironmentOutlined, 
    CustomerServiceOutlined,
    AlertOutlined,
    RightOutlined
} from "@ant-design/icons";

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
    <div className="page-shell">
      <section className="page-hero">
        <span className="soft-tag">安全求助</span>
        <h1 className="page-title" style={{ marginTop: "16px" }}>网页化紧急帮助中心</h1>
        <p className="page-subtitle">将原来的移动端求助页改成桌面端控制台式布局，保留原有求助入口和呼叫逻辑。</p>
      </section>

      <div className="page-content-grid">
        <section className="surface-card" style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#1f2937" }}>遇到紧急情况？</h2>
            <p style={{ marginTop: "10px", fontSize: "15px", color: "#64748b" }}>小安时刻守护你的安全，请优先使用下方快捷求助入口。</p>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '280px', height: '280px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'rgba(92, 69, 153, 0.06)' }}></div>
            <div style={{ position: 'absolute', inset: '28px', borderRadius: '50%', backgroundColor: 'rgba(92, 69, 153, 0.12)' }}></div>
            <button
              onClick={() => call110()}
              style={{
                width: "190px",
                height: "190px",
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg, #ef4444 0%, #7c3aed 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 20px 50px rgba(124, 58, 237, 0.28)",
                cursor: "pointer",
                zIndex: 2,
              }}
              type="button"
            >
              <AlertOutlined style={{ fontSize: "40px", marginBottom: "12px" }} />
              <span style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: '2px' }}>一键报警</span>
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
            提示：非紧急情况请勿随意点击报警按钮
          </p>
        </section>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: "22px" }}>
            <div className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>辅助求助</div>
            <div className="info-stack">
              <div className="section-card hover-rise" style={{ padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: '#f0eeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: '20px', color: '#5C4599' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>位置共享</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>实时同步位置给紧急联系人</div>
                </div>
                <RightOutlined style={{ color: '#cbd5e1', fontSize: '12px' }} />
              </div>

              <div onClick={() => callParent()} className="section-card hover-rise" style={{ padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>拨打家长电话</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>一键呼叫默认紧急联系人</div>
                </div>
                <RightOutlined style={{ color: '#cbd5e1', fontSize: '12px' }} />
              </div>

              <div onClick={() => call12355()} className="section-card hover-rise" style={{ padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: '#f0faff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CustomerServiceOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>12355 青少年服务</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>专业青少年心理与维权咨询</div>
                </div>
                <RightOutlined style={{ color: '#cbd5e1', fontSize: '12px' }} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Warn;
