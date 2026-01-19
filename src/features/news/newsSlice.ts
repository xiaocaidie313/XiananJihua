import { createSlice } from "@reduxjs/toolkit";
import { news } from "@/mock/news";

interface New {
    id:number;
    author:string;
    cover:string;
    time:
    {
        year:number;
        month:number;
        day:number;
        hour:number;
        minute:number;
        second:number;
    }
    province:string;
    title:string;
    content:string;
}
interface NewsState {
    news:New[];
}
const initialState:NewsState = {
    news:news,
}
const newsSlice = createSlice({
    name:'news',
    initialState,
    reducers:{
    }
})

// selector
import type { RootState } from "@/store";
export const getAllNews = (state: RootState) => state.news.news;

export const getNewsById = (state: RootState, id: number) => 
    state.news.news.find(item => item.id === id);

export const getSixNews = (state: RootState) => state.news.news.slice(0, 6);

export default newsSlice.reducer;
export type { NewsState, New };