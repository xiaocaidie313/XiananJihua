function NewsCardOutline(props){
    const {image, text=''} = props;

    return (
        <>
        <div style={{
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
                alignItems:'center',
                justifyContent:'center',
                padding:'0 2.5px 0 0',
                // borderRadius:'3px',

            }}>
                <span>{text}</span>
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
                backgroundColor:'red',
            }}>
                <img src={image} alt="" style={{
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