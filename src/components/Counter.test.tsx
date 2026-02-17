import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

describe('Counter', () => {
    it('Starts with count 0', () => {
        render(<Counter/>);
        expect(screen.getByRole('heading')).toHaveTextContent('Count: 0');
    });

    it('increments the count when Increment button is clicked', async () => {
        const user = userEvent.setup();
        render(<Counter/>);
        const incrementButton = screen.getByRole('button', { name: /Increment/i });
        await user.click(incrementButton);
        expect(screen.getByRole('heading')).toHaveTextContent('Count: 1');
    });

    it('decrements the count when Decrement button is clicked', async () => {
        const user = userEvent.setup();
        render(<Counter/>);
        const decrementButton = screen.getByRole('button', { name: /Decrement/i });
        await user.click(decrementButton);
        expect(screen.getByRole('heading')).toHaveTextContent('Count: -1');
    });

    it('resets the count to 0 when Reset button is clicked', async () => {
        const user = userEvent.setup();
        render(<Counter/>);
        const incrementButton = screen.getByRole('button', { name: /Increment/i });
        const resetButton = screen.getByRole('button', { name: /Reset/i });
        await user.click(incrementButton);
        await user.click(resetButton);
        expect(screen.getByRole('heading')).toHaveTextContent('Count: 0');
    });
});