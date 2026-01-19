import { useState } from 'react';
import { SearchIcon } from '../icon';
import { useLocation , useNavigate} from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import './index.css';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = () => {
        if (searchValue.trim()) {
            console.log('搜索:', searchValue);
            // 这里可以添加实际的搜索逻辑
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div 
            className={location.pathname.includes('shortvideo/details') ? 'header-container-vedio' : 'header-container'}
        
        
        >
            {
                location.pathname !== '/home' && (
                    <div 
                    onClick={() => navigate(-1)}
                    style={{
                        width:'10%',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        cursor:'pointer',
                        position:'absolute',
                        left:'10px',
                    }}>
                            <LeftOutlined />
                    </div>
                )
            }
            <div className="search-wrapper"
            style={{
                width:`${location.pathname === '/home' ? '100%' : '75%'}`,
            }}
            >

                <div className="search-icon-wrapper">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="搜索内容..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                />
            </div>
        </div>
    );
}

export default Header