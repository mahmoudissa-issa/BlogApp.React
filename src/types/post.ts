
export interface Post {
    id:number;
    title:string;
    slug:string;
    content:string;
    authorId:number;
    authorName:string;
    avatarUrl?:string;
    categoryId:number;
    categoryName:string;
    tagIds:number[];
    tagNames:string[];
    createdAt:string;
    publishedA:string;
    imageUrl?:string;
}

export interface CreatePostRequest {
    title:string;
    content:string;
    authorId:number;
    categoryId:number;
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