import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import authReducer from './authSlice';  
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,  
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
