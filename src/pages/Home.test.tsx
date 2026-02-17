import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

import postReducer from '../features/posts/postSlice';
import tagReducer from '../features/tags/tagSlice';
import authReducer from '../features/auth/authSlice';
import postDetailReducer from '../features/postDetails/postDetailSlice';
import profileReducer from '../features/profile/profileSlice';
import Home from './Home';

// Helper to create a fresh store for each test
const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      post: postReducer,
      tags: tagReducer,
      postDetail: postDetailReducer,
      profile: profileReducer,
    },
  });

// Helper to render Home with all required providers
const renderHome = () => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );
};

describe('Home Page', () => {
  it('displays posts after fetching from the API', async () => {
    renderHome();

    // Wait for posts to appear
    expect(await screen.findByText('Getting Started with React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Best Practices')).toBeInTheDocument();
    expect(screen.getByText('Building APIs with Node.js')).toBeInTheDocument();
  });

  it('displays tags after fetching from the API', async () => {
    renderHome();

    // Wait for tags to appear
    expect(await screen.findByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('displays author names on post cards', async () => {
    renderHome();

    expect(await screen.findByText('Getting Started with React')).toBeInTheDocument();
    expect(screen.getAllByText('John Doe')).toHaveLength(2); // 2 posts by John Doe
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays category badges on post cards', async () => {
    renderHome();

    expect(await screen.findByText('Getting Started with React')).toBeInTheDocument();
    expect(screen.getAllByText('Frontend')).toHaveLength(2);
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('filters posts when a tag is clicked', async () => {
    renderHome();

    // Wait for posts and tags to load
    expect(await screen.findByText('Getting Started with React')).toBeInTheDocument();

    // Click on the "TypeScript" tag
    const typescriptTag = screen.getByRole('button', { name: 'TypeScript' });
    await userEvent.click(typescriptTag);

    // Only TypeScript post should be visible
    expect(screen.getByText('TypeScript Best Practices')).toBeInTheDocument();
    expect(screen.queryByText('Getting Started with React')).not.toBeInTheDocument();
    expect(screen.queryByText('Building APIs with Node.js')).not.toBeInTheDocument();
  });

  it('shows all posts when "All" tag is clicked after filtering', async () => {
    renderHome();

    expect(await screen.findByText('Getting Started with React')).toBeInTheDocument();

    // Filter by React tag
    await userEvent.click(screen.getByRole('button', { name: 'React' }));
    expect(screen.queryByText('TypeScript Best Practices')).not.toBeInTheDocument();

    // Click "All" to reset filter
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Getting Started with React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Best Practices')).toBeInTheDocument();
    expect(screen.getByText('Building APIs with Node.js')).toBeInTheDocument();
  });

  it('filters posts by search query', async () => {
    renderHome();

    expect(await screen.findByText('Getting Started with React')).toBeInTheDocument();

    // Type in the search input
    const searchInput = screen.getByPlaceholderText(/search posts/i);
    await userEvent.type(searchInput, 'TypeScript');

    // Only TypeScript post should be visible
    expect(screen.getByText('TypeScript Best Practices')).toBeInTheDocument();
    expect(screen.queryByText('Getting Started with React')).not.toBeInTheDocument();
    expect(screen.queryByText('Building APIs with Node.js')).not.toBeInTheDocument();
  });

  it('shows empty state when no posts match search', async () => {
    renderHome();

    expect(await screen.findByText('Getting Started with React')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search posts/i);
    await userEvent.type(searchInput, 'nonexistent post xyz');

    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  it('shows error alert when API fails', async () => {
    // Override the handler to return an error
    server.use(
      http.get('*/api/posts', () => {
        return HttpResponse.json(
          { message: 'Server error' },
          { status: 500 }
        );
      })
    );

    renderHome();

    // Wait for error message to appear
    expect(await screen.findByText(/Request failed with status code 500/i)).toBeInTheDocument();
  });

  it('displays the hero section', async () => {
    renderHome();

    expect(screen.getByText('FullStack Blog App')).toBeInTheDocument();
    expect(screen.getByText('Click a tag to explore posts by topic')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search posts/i)).toBeInTheDocument();
  });
});
