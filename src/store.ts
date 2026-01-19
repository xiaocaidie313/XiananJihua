import { configureStore } from '@reduxjs/toolkit'
import carouselReducer from './features/carousel/carousleSlice'
import newsReducer from './features/news/newsSlice'
import vediosReducer from './features/vedios/vediosSlice'
import podcastReducer from './features/podcast/podcastSlice'
// 创建 Redux Store
// configureStore 是 Redux Toolkit 提供的简化方法
export const store = configureStore({
  reducer: {
    // 这里添加所有的 reducer
    // carousel 是状态的名字， carouselReducer 是处理这个状态的函数
    carousel: carouselReducer,
    news: newsReducer,
    vedios: vediosReducer,
    podcast: podcastReducer,
  },
})

// 导出类型，方便在 TypeScript 中使用
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
