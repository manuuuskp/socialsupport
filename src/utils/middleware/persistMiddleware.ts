import { type Middleware } from '@reduxjs/toolkit';
import { saveAppState } from '../storage/storage';
import { LOCAL_STORAGE_KEY } from '../constants/constants';

export const persistMiddleware = (sliceKeys: string[]): Middleware => {
  return (storeAPI) => (next) => (action) => {
    const result = next(action);

    const state = storeAPI.getState();

    const slicesToPersist: Record<string, any> = {};
    sliceKeys.forEach((key) => {
      if (state[key] !== undefined) {
        slicesToPersist[key] = state[key];
      }
    });

    if (Object.keys(slicesToPersist).length > 0) {
      saveAppState(LOCAL_STORAGE_KEY, slicesToPersist);
    }

    return result;
  };
};
