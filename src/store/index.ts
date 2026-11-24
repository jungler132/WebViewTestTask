import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { balanceReducer } from './balanceSlice';
import { tasksReducer } from './tasksSlice';
import { statusReducer } from './statusSlice';

export const store = configureStore({
  reducer: {
    balance: balanceReducer,
    tasks: tasksReducer,
    status: statusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
