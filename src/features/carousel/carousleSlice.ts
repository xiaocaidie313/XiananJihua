import { createSlice} from "@reduxjs/toolkit";
// 导入图片（Vite 中需要这样导入静态资源）
import image01 from '@/assets/images/carousel/01.jpg';
import image02 from '@/assets/images/carousel/02.jpg';
import image03 from '@/assets/images/carousel/03.jpg';

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
    images: [
        {
            id: 1,
            url: image01,
        },
        {
            id: 2,
            url: image02,
        },
        {
            id: 3,
            url: image03,
        },
    ],
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

// 导出 reducer（用于在 store 中使用）
export default carouselSlice.reducer;