
export interface Post {
    id:number;
    title:string;
    slug:string;
    content:string;
    authorId:number;
    authorName:string;
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
    tagIds:number[];
    postImage?:File | null;

}

export interface UpdatePostRequest extends CreatePostRequest {
    id:number;
}