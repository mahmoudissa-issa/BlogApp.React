

import Register from './Register';
import { screen} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js';
import { renderWithProviders } from '../../utils/test-utils';

// Mock useAppDispatch to capture dispatched actions
const mockDispatch = vi.fn();
vi.mock('../../app/hooks', async () => {
  const actual = await vi.importActual('../../app/hooks');
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});


describe('Register',() =>{
    beforeEach(() => {
        mockDispatch.mockClear();
    });

    it('renders the registration form', () => {
        renderWithProviders (<Register />);
        expect(screen.getByRole('heading', { name: /Sign up to an account/i })).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    });

    it('allow typing in the form fields', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Register />);

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


})