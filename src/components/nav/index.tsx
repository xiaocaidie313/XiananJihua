import { useLocation, useNavigate } from "react-router-dom";
import { CartoonIcon, PodcastIcon, ShortVideoIcon } from "../icon";
function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const pages = [
        {
            name: '短视频',
            page: 'shortvideo',
            path: '/shortvideo',
            icon: <ShortVideoIcon />,
        },
        {
            name: '条漫',
            page: 'cartoon',
            path: '/cartoon',
            icon: <CartoonIcon />,

        },
        {
            name: '播客',
            page: 'podcast',
            path: '/podcast',
            icon: <PodcastIcon />,

        },
    ]
    return (
        <>
            <div
                className="lightpurple"
                style={{
                    width: '100%',
                    height: '80px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    border: '1px solid #e5e5e5',

                }}
            >
                {pages.map(item => {
                    return (
                        <div key={item.path} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                            cursor: 'pointer',
                        }}
                            onClick={() => {
                                if (item.path === '/podcast' || item.path === '/cartoon' || item.path === '/shortvideo') {
                                    navigate(item.path, { state: { backgroundLocation: location } });
                                    console.log('我是nav点击时候的',location)
                                    return;
                                }
                                navigate(item.path);
                            }}
                        >
                            {item.icon && item.icon}
                            <span>{item.name}</span>
                        </div>
                    )
                })}

            </div>
        </>
    )
}

export default Nav;