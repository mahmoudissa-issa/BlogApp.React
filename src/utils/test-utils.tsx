import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/posts/postSlice";
import tagReducer from "../features/tags/tagSlice";
import postDetailReducer from "../features/postDetails/postDetailSlice";
import profileReducer from "../features/profile/profileSlice";
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      post: postReducer,
      tags: tagReducer,
      postDetail: postDetailReducer,
      profile: profileReducer,
      // add your other reducers here
    },
    preloadedState,
  });
};

export const renderWithProviders = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ui: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined,
  { preloadedState = {}, route = '/', ...options } = {}
) => {
  const store = createTestStore(preloadedState);
  const mockDispatch = vi.spyOn(store, 'dispatch');

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter>
    </Provider>
  );

  return {
    store,
    mockDispatch,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
};