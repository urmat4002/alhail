import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import ModalSlice from './features/Modal/ModalSlice';

export const store = configureStore({
  reducer: {
    modalSlice: ModalSlice,
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
