
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from './authSlice';
import Register from './Register';
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js';

// Mock useAppDispatch to capture dispatched actions
const mockDispatch = vi.fn();
vi.mock('../../app/hooks', async () => {
  const actual = await vi.importActual('../../app/hooks');
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});

//Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState: initialState,
  });
};

// Helper to render Register with all required wrappers
const renderRegister = (initialState = {}) => {
  const store = createMockStore(initialState);

    render(
        <Provider store={store}>
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        </Provider>
    );  
};

describe('Register',() =>{
    beforeEach(() => {
        mockDispatch.mockClear();
    });

    it('renders the registration form', () => {
        renderRegister();
        expect(screen.getByRole('heading', { name: /Sign up to an account/i })).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    });

    it('allow typing in the form fields', async () => {
        const user = userEvent.setup();
        renderRegister();

        const usernameInput = screen.getByLabelText('Username');
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password');

        await user.type(usernameInput, 'testuser');
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');

        expect(usernameInput).toHaveValue('testuser');
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
        expect(confirmPasswordInput).toHaveValue('password123');
    });

    it('dispatches register thunk when form is submitted with valid data', async () => {
        const user = userEvent.setup();
        renderRegister();
        await user.type(screen.getByLabelText('Username'), 'testuser');
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.type(screen.getByLabelText('Confirm Password'), 'password123');
        await user.click(screen.getByLabelText(/Read and comment on posts/i));
        await user.click(screen.getByRole('button', { name: /Sign up/i }));
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });

})