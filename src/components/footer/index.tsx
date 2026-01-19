// import { HomeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon,WarnIcon,ChatIcon,MeIcon,SupportIcon,LikeIcon,CommentIcon } from "../icon";
import "./index.css";
import {Avatar} from "antd";
import { UserOutlined,HeartOutlined } from "@ant-design/icons";
function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
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
    <>
    {/* // 最外部边框 - fixed 定位需要背景色和 z-index */}

  {pathname.includes('news') ? 
  (<div className="container" style={{ backgroundColor: 'white' }}>
        <div style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          padding:'10px 20px',
          width:'100%',
          height:'100%',
        }}>
          {/* 左侧：作者信息 */}
          <div className="avatar"
            style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'flex-start',
              gap:'12px',
              flex: 1,
            }}
          >
            <Avatar 
              size={45} 
              icon={<UserOutlined style={{fontSize:20}} />}
              style={{ backgroundColor: '#944A94' }}
            />
            <div style={{
              display:'flex',
              flexDirection:'column',
              alignItems:'flex-start',
              gap:'2px',
            }}>
              <span style={{ 
                fontSize: '15px', 
                fontWeight: '500',
                color: '#333'
              }}>小安</span>
              <span style={{ 
                fontSize: '12px', 
                color: '#999'
              }}>关注</span>
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <div className='action'>
            <div className="action-item" 
            style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'flex-end',
              gap:'20px',
            }}
            >
              <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                gap:'2px',
                cursor:'pointer',
              }}>
                <SupportIcon />
                <span style={{ fontSize: '12px', color: '#666' }}>123</span>
              </div>
              
              <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                gap:'2px',
                cursor:'pointer',
              }}>
                <LikeIcon />
                <span style={{ fontSize: '12px', color: '#666' }}>456</span>
              </div>
              
              <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                gap:'2px',
                cursor:'pointer',
              }}>
                <CommentIcon />
                <span style={{ fontSize: '12px', color: '#666' }}>789</span>
              </div>
            </div>
          </div>

        </div>
    </div>):(  <div className="container footer-purple">
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
    </div>)}
    </>
  )
}
export default Footer;
