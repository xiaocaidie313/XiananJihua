import { createSlice } from "@reduxjs/toolkit";
import { vedios } from "@/mock/vedios";

interface Vedio {
    id:number;
    url:string;
    cover:string;
    title:string;
    author:string;
    time:{
        year:number;
        month:number;
        day:number; 
        hour:number;
        minute:number;
        second:number;
    }
}
interface VediosState {
    vedios:Vedio[];
}
const initialState:VediosState = {
    vedios:vedios,
}

const vediosSlice = createSlice({
    name:'vedios',
    initialState,
    reducers:{
    }
})

// selector
import type { RootState } from "@/store";

export const getAllVedios = (state: RootState) => state.vedios.vedios;
export const getVedioById = (state: RootState, id: number) => 
    state.vedios.vedios.find(item => item.id === id);

export default vediosSlice.reducer;
export type { Vedio, VediosState };