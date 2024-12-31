import { store } from './store';
import productReducer from './productSlice';
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import { RootState, AppDispatch } from './store';

describe('Redux Store', () => {
  it('should have the correct initial state for product', () => {
    const state = store.getState();
    expect(state.product).toEqual(productReducer(undefined, { type: '' }));
  });

  it('should have the correct initial state for auth', () => {
    const state = store.getState();
    expect(state.auth).toEqual(authReducer(undefined, { type: '' }));
  });

  it('should have the correct initial state for cart', () => {
    const state = store.getState();
    expect(state.cart).toEqual(cartReducer(undefined, { type: '' }));
  });

  it('should return the correct RootState type', () => {
    const state: RootState = store.getState();
    expect(state).toHaveProperty('product');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('cart');
  });

  it('should return the correct AppDispatch type', () => {
    const dispatch: AppDispatch = store.dispatch;
    expect(dispatch).toBeDefined();
  });
}
);
