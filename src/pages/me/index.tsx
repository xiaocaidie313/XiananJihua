import { Avatar } from "antd";
import { UserOutlined, RightOutlined, BarChartOutlined, MessageOutlined, InfoCircleOutlined } from "@ant-design/icons";

function Me() {
  const menuItems = [
    {
      title: "个人数据看板",
      icon: <BarChartOutlined style={{ fontSize: "20px" }} />,
      onClick: () => console.log("个人数据看板"),
    },
    {
      title: "反馈&建议",
      icon: <MessageOutlined style={{ fontSize: "20px" }} />,
      onClick: () => console.log("反馈&建议"),
    },
    {
      title: "关于小安",
      icon: <InfoCircleOutlined style={{ fontSize: "20px" }} />,
      onClick: () => console.log("关于小安"),
    },
  ];

  return (
    <div className="page-shell">
      <section className="page-hero">
        <span className="soft-tag">个人中心</span>
        <h1 className="page-title" style={{ marginTop: "16px" }}>
          更像网页后台的个人空间
        </h1>
        <p className="page-subtitle">不改原有功能入口，只把展示方式换成更适合 PC 浏览的卡片布局。</p>
      </section>

      <div className="page-content-grid">
        <section className="surface-card" style={{ padding: "28px" }}>
          <div
            className="lightpurple"
            style={{
              width: "100%",
              padding: "30px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Avatar
                size={76}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#891DB4",
                  border: "4px solid white",
                  boxShadow: "0 8px 24px rgba(137, 29, 180, 0.18)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>姓名</span>
                <span style={{ fontSize: "14px", color: "#5b6475" }}>查看个人资料与最近活动记录</span>
              </div>
            </div>
            <RightOutlined style={{ fontSize: "18px", color: "#891DB4" }} />
          </div>

          <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick}
                className="section-card hover-rise"
                style={{
                  width: "100%",
                  padding: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "14px",
                      backgroundColor: "#f3f0ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#891DB4",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>{item.title}</span>
                </div>
                <RightOutlined style={{ fontSize: "16px", color: "#94a3b8" }} />
              </div>
            ))}
          </div>
        </section>

        <aside className="page-side-column">
          <div className="surface-card" style={{ padding: "22px" }}>
            <div className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>账号概览</div>
            <div className="info-stack">
              <div className="info-row"><strong>身份</strong><span>学生用户</span></div>
              <div className="info-row"><strong>最近访问</strong><span>资讯 / 短视频 / 播客</span></div>
              <div className="info-row"><strong>状态</strong><span>已登录</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Me;
