// import { HomeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon,WarnIcon,ChatIcon,MeIcon } from "../icon";
import "./index.css";
function Footer() {
  const navigate = useNavigate();
  const pages = [
    {
      page: "首页",
      path: "/home",
      icon: <HomeIcon />,
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

  const [active, setActive] = useState(true);
  function handleClick(path: string) {
    setActive(!active);
    navigate(path);
  }
  return (
    // 最外部边框 - fixed 定位需要背景色和 z-index
    <div className="container footer-purple">
      {/* 内部结构 */}
      {/* className="flex justify-evenly items-center gap-4 p-4 h-full" */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
          height: "100%",
        }}
      >
        {/* 单个部分的结构 - 统一使用 span，h1 标签不适合用在 footer 导航中 */}

        {pages.map((item) => {
          return (
            <div
              key={item.path}
              style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                gap:'2px',
                cursor:'pointer',
                color:'white',
                // hover:'opacity-70',
              }}
              // className="flex flex-col items-center gap-2 justify-center cursor-pointer hover:opacity-70"
              onClick={() => handleClick(item.path)}
            >
              {item.icon && <span>{item.icon}</span>}
              <span className="text-sm font-medium">{item.page}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Footer;
