import { createSelector, createSlice } from "@reduxjs/toolkit";
import { news } from "@/mock/news";
import type { RootState } from "@/store";

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
const selectNews = (state: RootState) => state.news.news;

export const getAllNews = selectNews;

export const getNewsById = (state: RootState, id: number) =>
    selectNews(state).find(item => item.id === id);

export const getSixNews = createSelector(
    [selectNews],
    (newsItems) => newsItems.slice(0, 6)
);

export default newsSlice.reducer;
export type { NewsState, New };