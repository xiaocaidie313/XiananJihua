import { useNavigate } from "react-router-dom";
import { HomeIcon, WarnIcon, ChatIcon, MeIcon } from "@/components/icon";
function Header() {
  const navigate = useNavigate();
  function handleClick(path: string) {
    navigate(path);
  }
  const pages = [
    {
      page: "首页",
      path: "/home",
      icon: <HomeIcon style={{ width: "25px", height: "25px" }} />,
    },
    {
      page: "报警",
      path: "/warn",
      // 'icon':<WarningOutlined />
      icon: <WarnIcon />,
    },
    {
      page: "对话",
      path: "/chat",
      // 'icon':<HomeOutlined />
      icon: <ChatIcon />,
    },
    {
      page: "我的",
      path: "/me",
      // 'icon':<HomeOutlined />
      icon: <MeIcon />,
    },
  ];
  return (
    <>
      <div
        className="footer-purple"
        style={{
          width: "100%",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor:'white',
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          zIndex: 1000,
          padding: "10px 16px",
          boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            gap: "16px",
            height: "100%",
          }}
        >
          {/* 单个部分的结构 - 统一使用 span，h1 标签不适合用在 footer 导航中 */}

          {pages.map((item) => {
            return (
              <div
                key={item.path}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  cursor: "pointer",
                  color: "white",
                  // hover:'opacity-70',
                }}
                // className="flex flex-col items-center gap-2 justify-center cursor-pointer hover:opacity-70"
                onClick={() => handleClick(item.path)}
              >
                {item.icon && <span>{item.icon}</span>}
                {!item.icon && <span className="text-sm font-medium">{item.page}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Header;
