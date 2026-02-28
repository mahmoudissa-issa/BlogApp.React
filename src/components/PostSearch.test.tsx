import { renderWithProviders } from "../utils/test-utils";
import PostSearch from "./PostSearch";
import { mockPosts } from "../mocks/data";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("PostSearch component", () => {
  beforeEach(() => {
    renderWithProviders(<PostSearch posts={mockPosts} />);
  });
  it("renders the search input", () => {
    expect(screen.getByPlaceholderText(/Search posts.../i)).toBeInTheDocument();
  });

  it("displays all post initially", () => {
    expect(screen.getByText("Getting Started with React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.getByText("Building APIs with Node.js")).toBeInTheDocument();
  });

  it("filters posts based on search query", async () => {
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/Search posts.../i);
    await user.type(searchInput, "React");
    expect(screen.getByText("Getting Started with React")).toBeInTheDocument();
    expect(
      screen.queryByText("TypeScript Best Practices"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Building APIs with Node.js"),
    ).not.toBeInTheDocument();
  });

  it("shows a message when no post found", async () => {
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/Search posts.../i);
    await user.type(searchInput, "NonExistingPost");

    console.log(screen.debug());
    expect(await screen.findByText("No Posts Found")).toBeInTheDocument();
  });

  it('clears search show all posts again',async() =>{
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/Search posts.../i);
    await user.type(searchInput, "React");
    expect(screen.getByText("Getting Started with React")).toBeInTheDocument();
    await user.clear(searchInput);
    expect(screen.getByText("Getting Started with React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.getByText("Building APIs with Node.js")).toBeInTheDocument();
  });
});
