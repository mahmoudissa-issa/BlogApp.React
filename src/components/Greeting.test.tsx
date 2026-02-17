import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

describe("Greeting", () => {
  it("renders the heading with the name passed as prop", () => {
    render(<Greeting name="John" />);
    expect(
      screen.getByRole("heading", { name: /Hello, John!/i}),
    ).toBeInTheDocument();
  });
  it("Shows the welcome message", () => {
    render(<Greeting name="John" />);
    expect(screen.getByText(/Welcome to our blog app!/i)).toBeInTheDocument();
  });
  it('renders a different name when prop changes', () => {
    const { rerender } = render(<Greeting name="John" />);  
    expect(screen.getByRole("heading", { name: /Hello, John!/i })).toBeInTheDocument();
    rerender(<Greeting name="Jane" />);
    expect(screen.getByRole("heading", { name: /Hello, Jane!/i })).toBeInTheDocument();
  });

});
