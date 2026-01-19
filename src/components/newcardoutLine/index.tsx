import { useNavigate } from 'react-router-dom';
import type { New } from '@/features/news/newsSlice';

function NewsCardOutline(props: { news: New }) {
    const { news } = props;
    const { title, cover, id } = news; 
    const navigate = useNavigate();
    
    return (
        <>
        <div 
        onClick={() => navigate(`/news/${id}`)}
        style={{
            cursor: 'pointer',
            width:'100%',
            height:'100px',
            display:'flex',
            // padding:'3px 0',
            // gap:'5px',
            borderRadius:'10px',
            border:'1px solid #e5e5e5',
        }}>
            {/* 文字内容 */}
            <div style={{
                width:'60%',    
                height:'100%',
                backgroundColor:'#FFFCFF',
                display:'flex',
                alignItems:'start',
                justifyContent:'center',
                padding:'15px 5px 0 10px',
                // borderRadius:'3px',
                textAlign:'left',
                color:'#333',
                lineHeight:'1.5',
            }}>
                <span>{title}</span>
            </div>
            {/* 图片展示 */}
            <div style={{
                width:'40%',
                height:'100%',
                objectFit:'cover',
                borderRadius:'10px',
                display:'flex',
                // padding:'0 0 0 2.5px',

                alignItems:'center',
                justifyContent:'center',
                backgroundColor:'#FFFCFF',
            }}>
                <img src={cover} alt="" style={{
                    width:'100%',
                    height:'100%',
                    objectFit:'cover',
                    borderRadius:'10px',
                }} />
            </div>
         </div>   
        </>
    )
}
export default NewsCardOutline