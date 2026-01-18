import Header from '../../components/header/index';
import VedioCardOutline from '../../components/vediocardoutline/index';
import { useState } from 'react';
function ShortVideo() {
    return (
        <>
        <Header />
        <div style={{
            width:'100%',
            padding:'68px 10px',
            display:'flex',
            gap:'5px',
        }}>
           <div style={{
            width:'100%',
            height:'100%',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            gap:'5px',
           }}>
            {
                Array.from({length: 10}).map((_, index) => (
                    <VedioCardOutline key={index} />
                ))
            }
           </div>
           <div style={{
            width:'100%',
            height:'100%',
            display:'flex',
            flexDirection:'column',
            gap:'5px',
            justifyContent:'center',
           }}>
            {
                Array.from({length: 10}).map((_, index) => (
                    <VedioCardOutline key={index} />
                ))
            }
            </div>
        </div>
        </>
    )
}
export default ShortVideo;