import { Dispatch, MouseEvent, SetStateAction } from "react";

export interface iPosts {
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
export interface ModalContextInterface {
    showModal: boolean, 
    setShowModal: Dispatch<SetStateAction<boolean>>,
    post: iPosts | undefined, 
    setPost: Dispatch<SetStateAction<iPosts | undefined>>
}

export interface iPostWithOnClick extends iPosts {
    onClickModal : (e:MouseEvent<HTMLDivElement>) => void
}