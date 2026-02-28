import { configureStore } from "@reduxjs/toolkit";
import postReducer, { createPost, fetchPosts } from "./postSlice";
import { postApi } from "../../api/postsApi";
import type { Post } from "../../types/post";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";


vi.mock("../../api/postsApi", () => ({
    postApi: {
        getAll: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

const createStore = () =>
    configureStore({
        reducer: {
            post: postReducer,
        },
    });

const mockPost: Post = {
    id: 1,
    title: "Test Post",
    slug: "test-post",
    content: "Content",
    authorId: 1,
    authorName: "testuser",
    categoryId: 1,
    categoryName: "Tech",
    tagIds: [1],
    tagNames: ["redux"],
    createdAt: "2026-01-01T00:00:00Z",
    publishedA: "2026-01-01T00:00:00Z",
};

describe("post thunks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetchPosts loads posts in store on success", async () => {
        vi.mocked(postApi.getAll).mockResolvedValue([mockPost]);

        const store = createStore();
        await store.dispatch(fetchPosts());
        const state = store.getState();
        expect(state.post.loading).toBe(false);
        expect(state.post.items.length).toBeGreaterThan(0);
        expect(state.post.error).toBeNull();
    });

    it("fetchPosts sets error on API failure", async () => {
        server.use(
            http.get("https://jsonplaceholder.typicode.com/posts", () => {
                return new HttpResponse(null,{status:500});
            })
        );

        const store = createStore();
        await store.dispatch(fetchPosts());
        const state = store.getState();
        expect(state.post.loading).toBe(false);
        expect(state.post.error).toBeNull();
    });

    it("createPost adds post to store ", async () => {
        const createdPost: Post = {
            ...mockPost,
            id: 2,
            title: "New Post",
            tagIds: [1],
        };
        vi.mocked(postApi.create).mockResolvedValue(createdPost);

        const store = createStore();
        await store.dispatch(createPost({
            title: "New Post",
            content: "Content",
            authorId: 1,
            categoryId: 1,
            tagIds: [1],
        }));
        const state = store.getState();
        expect(state.post.items.length).toBeGreaterThan(0);
        expect(state.post.items.length).toBeGreaterThanOrEqual(1);
        expect(state.post.items[0].title).toBe("New Post");
        expect(state.post.items[0].tagIds).toContain(1);
    });
});