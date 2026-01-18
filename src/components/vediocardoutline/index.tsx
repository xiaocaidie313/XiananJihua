import image from '@/assets/images/carousel/01.jpg';
function VedioCardOutLine(){
    return (
        <>
        <div style={{
            width:'100%',
            // height:'auto',
            height:'250px',
            minHeight:'250px',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:'#f0f0f0',
            borderRadius:'10px',
            border:'1px solid #e5e5e5',
            
        }}>
            <img src={image} alt="" style={{
                width:'100%',
                height:'100%',
                objectFit:'cover',
            }} />
            {/* <img src={image} alt="" /> */}
        </div>
        </>
    )
}
export default VedioCardOutLine