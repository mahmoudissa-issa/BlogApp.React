import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from './authSlice';
import type { AuthUser } from '../../types/auth';

const mockUser: AuthUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'Reader',
};

const createStoreWithUser = () =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: mockUser,
        token: 'fake-token-123',
        status: 'idle' as const,
      },
    },
  });

describe('Logout', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token-123');
    localStorage.setItem('user', JSON.stringify(mockUser));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('clears user from state', () => {
    const store = createStoreWithUser();

    store.dispatch(logout());

    expect(store.getState().auth.user).toBeNull();
  });

  it('clears token from state', () => {
    const store = createStoreWithUser();

    store.dispatch(logout());

    expect(store.getState().auth.token).toBeNull();
  });

  it('removes token from localStorage', () => {
    const store = createStoreWithUser();

    store.dispatch(logout());

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('removes user from localStorage', () => {
    const store = createStoreWithUser();

    store.dispatch(logout());

    expect(localStorage.getItem('user')).toBeNull();
  });
});
