import { createSlice } from "@reduxjs/toolkit";
import { podcast } from "@/mock/podcast";

interface PodcastSection {
    time: string;
    title: string;
}

interface PodcastItem {
    id: number;
    title: string;
    url: string;
    author: string;
    cover?: string;
    description?: string;
    sections?: PodcastSection[];
    time: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
}

interface PodcastState {
    podcast: PodcastItem[];
}

const initialState: PodcastState = {
    podcast,
};

const podcastSlice = createSlice({
    name: "podcast",
    initialState,
    reducers: {},
});

import type { RootState } from "@/store";

export const getAllPodcasts = (state: RootState) => state.podcast.podcast;
export const getPodcastById = (state: RootState, id: number) =>
    state.podcast.podcast.find((item) => item.id === id);
export const getFirstPodcast = (state: RootState) => state.podcast.podcast[0];

export default podcastSlice.reducer;
export type { PodcastItem, PodcastState, PodcastSection };
