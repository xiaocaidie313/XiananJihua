import { configureStore } from '@reduxjs/toolkit'
import carouselReducer from './features/carousel/carousleSlice'
import newsReducer from './features/news/newsSlice'
import podcastReducer from './features/podcast/podcastSlice'
// 创建 Redux Store
export const store = configureStore({
  reducer: {
    carousel: carouselReducer,
    news: newsReducer,
    podcast: podcastReducer,
  },
})

// 导出类型，方便在 TypeScript 中使用
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
