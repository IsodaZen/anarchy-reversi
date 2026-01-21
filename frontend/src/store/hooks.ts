import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// TypeScript用の型付きフック
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
