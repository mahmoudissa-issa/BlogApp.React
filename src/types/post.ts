import z from "zod";

export interface Post {
    id:number;
    title:string;
    slug:string;
    content:string;
    authorId:number;
    authorName:string;
    avatarUrl?:string;
    tagIds:number[];
    tagNames:string[];
    createdAt:string;
    publishedA:string;
    imageUrl?:string;
}

/* ── Zod schema for PostForm validation ── */
export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  content: z.string().min(1, "Content is required"),
  tagNames: z.array(z.string()).min(1, "Select at least one tag"),
});

export type PostFormData = z.infer<typeof postFormSchema>;

export interface CreatePostRequest {
    title:string;
    content:string;
    authorId:number;
    tagNames:string[];
    postImage?:File | null;

}

export interface UpdatePostRequest extends CreatePostRequest {
    id:number;
}


export interface Comment {
    id:number;
    content:string;
    createdAt:string;
    postId:number;
    postTitle:string;
    userId:number;
    userName:string;
    avatrUrl?:string;
}

export interface CreateCommentRequest {
    postId:number;
    content:string;
}

export interface UpdateCommentRequest {
    id: number;
    content: string;
}