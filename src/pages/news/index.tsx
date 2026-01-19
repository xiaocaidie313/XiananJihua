import Footer from '@/components/footer';
import Header from '@/components/header';
import { useAppSelector } from '@/store/hooks';
import { getNewsById } from '@/features/news/newsSlice';
import { useParams } from 'react-router-dom';

function News() {
    const { id } = useParams();
    const news = useAppSelector(state => getNewsById(state, Number(id)));

    if (!news) return <div>内容加载中...</div>;

    const { title, author, time, province, content } = news;
    return (
        <>
        <Header />
        <div
            style={{
                width:'100%',
                height:'calc(100vh - 120px)', // 减去 App.tsx 中 main 的 paddingBottom
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'start',
                paddingTop:'60px',
                overflowY: 'auto', // 关键：禁止整个页面的滚动
                boxSizing: 'border-box',
                backgroundColor: '#fff'

            }}
         >
            <div 
                className='head-container'
                style={{
                    width:'100%',
                    flex: 1, // 占据剩余所有空间
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    justifyContent:'start',
                    gap:'15px',
                    padding:'20px',
                    overflow: 'hidden' // 内部也不滚动
                }}
            >
                {/* 标题 */}
                <div
                    className="title"
                    style={{
                        fontSize:'22px',
                        fontWeight:'bold',
                        width:'100%',
                        textAlign:'left',
                        lineHeight:'1.4',
                        color:'#333',
                        flexShrink: 0 // 确保标题不被压缩
                    }}
                >
                    {title}
                </div>

                {/* 文章信息 */}
                <div
                    className='info'
                    style={{
                        fontSize:'13px',
                        width:'100%',
                        textAlign:'left',
                        color:'#999',
                        display:'flex',
                        gap:'10px',
                        flexShrink: 0 // 确保信息不被压缩
                    }}
                >
                    <span className='author'>{author}</span>
                    <span className='time'>{time.year}年{time.month}月{time.day}日 {time.hour}:{time.minute}</span>
                    <span className='location'>{province}</span>
                </div>

                {/* 分割线 */}
                <div style={{
                    width:'100%',
                    height:'1px',
                    backgroundColor:'#f0f0f0',
                    flexShrink: 0
                }}></div>

                {/* 正文内容 - 如果你想让正文内部可以滑动而页面不动，可以给这层加 overflowY: 'auto' */}
                {/* 如果你希望完全不动，就保持 overflow: 'hidden' */}
                <div
                    className='content'
                    style={{
                        width:'100%',
                        padding:'10px 0',
                        fontSize:'16px',
                        lineHeight:'1.8',
                        color:'#333',
                        textAlign:'justify',
                        overflow: 'hidden', // 完全禁止滚动
                        textOverflow: 'ellipsis'
                    }}
                >
                    <p>
                        {content}
                    </p>
                </div>
            </div>
         </div>
         <Footer />
        </>
    )
}
export default News