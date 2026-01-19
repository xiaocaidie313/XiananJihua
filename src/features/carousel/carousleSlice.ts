import { createSlice} from "@reduxjs/toolkit";
import { carousles } from "@/mock/carousles";
// 定义图片的类型
interface CarouselImage {
    id: number;
    url: string;
}

// 定义状态的类型
interface CarouselState {
    images: CarouselImage[];
    currentIndex: number; // 当前显示的图片索引
}

// 初始状态
const initialState: CarouselState = {
    images: carousles,
    currentIndex: 0,
};

// 创建 slice
const carouselSlice = createSlice({
    name: 'carousel', // slice 的名字
    initialState,    // 初始状态
    reducers: {
        // 设置图片列表
        setImages: (state, action) => {
            state.images = action.payload;
        },
        // 设置当前显示的图片索引
        setCurrentIndex: (state, action) => {
            state.currentIndex = action.payload;
        },
        // 下一张图片
        nextImage: (state) => {
            state.currentIndex = (state.currentIndex + 1) % state.images.length;
        },
        // 上一张图片
        prevImage: (state) => {
            state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length;
        },
    },
});

// 导出 actions（用于在组件中调用）
export const { setImages, setCurrentIndex, nextImage, prevImage } = carouselSlice.actions;

// ✅ Selector 应该接收全局 RootState
import type { RootState } from "@/store";
export const getCarouselImages = (state: RootState) => state.carousel.images;
export const getCarouselCurrentIndex = (state: RootState) => state.carousel.currentIndex;

// 导出 reducer（用于在 store 中使用）
export default carouselSlice.reducer;
export type { CarouselImage, CarouselState };