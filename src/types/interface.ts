import { MouseEvent } from "react";

export interface iPost {
    id: string,
    avartar?: string,
    like: Array<string>,
    likes: number,
    view: number,
    createdAt: number,
    image: string,
    title: string,
    userId: string,
    description: string,
    username: string,
    address: string,
    comments: Comment[] | null,    
}

export type Comment = {
    uid: string,
    displayName: string,
    comment: string,
    createdAt: number,
}
export interface modalPosts {
    id: string,
    avartar: string,
    like: Array<string>,
    view: number,
    createdAt: number,
    image: string,
    title: string,
    userId: string,
    description: string,
    username: string,
    address: string,
    comments: Comment[] | null,
    
}


export interface iPostsParams {
    id?: string,
    like?: Array<string>,
    view?: number,
    createdAt?: number,
    image?: string,
    title?: string,
    userId?: string,
    username?: string,
    address?: string,
    
}

export interface iPostWithOnClick extends iPost {
    onClickModal : (e:MouseEvent<HTMLDivElement>) => void
}