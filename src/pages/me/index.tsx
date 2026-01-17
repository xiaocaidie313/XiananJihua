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
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "20px",
        backgroundColor: "#F5F5F5",
      }}
    >
      {/* 用户信息卡片 */}
      <div
        className="lightpurple"
        style={{
          width: "100%",
          padding: "30px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Avatar
            size={70}
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#891DB4",
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <span style={{ fontSize: "20px", fontWeight: "600", color: "#333" }}>
              姓名
            </span>
            <span style={{ fontSize: "14px", color: "#666" }}>
              点击查看个人资料
            </span>
          </div>
        </div>
        <RightOutlined
          style={{
            fontSize: "18px",
            color: "#891DB4",
          }}
        />
      </div>

      {/* 菜单列表 */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            style={{
              width: "100%",
              padding: "20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#EDD3ED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#891DB4",
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>
                {item.title}
              </span>
            </div>
            <RightOutlined
              style={{
                fontSize: "16px",
                color: "#999",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Me;
