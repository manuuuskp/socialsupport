import { configureStore } from '@reduxjs/toolkit';
import socialSupportFormReducer, { formSliceName,} from './socialSupportFormSlice';
import { persistMiddleware } from '../utils/middleware/persistMiddleware';
import { loadFromLocalStorage } from '../utils/storage/storage';
import type { FormState } from '../types';

export interface RootState {
  socialSupportForm: FormState;
}

const PERSISTED_SLICES: (keyof RootState)[] = [formSliceName];

const preloadedState = loadFromLocalStorage<RootState>(PERSISTED_SLICES, {} as RootState);

export const store = configureStore({
  reducer: {
    socialSupportForm: socialSupportFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware(PERSISTED_SLICES)),
  preloadedState,
});

export type AppDispatch = typeof store.dispatch;
