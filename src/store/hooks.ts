import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

// 在组件中使用这些 hooks，而不是直接使用 react-redux 的 hooks
// 这样可以自动获得 TypeScript 类型支持

// 用于获取 dispatch 函数（用于调用 actions）
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

// 用于获取 state（用于读取状态）
export const useAppSelector = useSelector.withTypes<RootState>()
