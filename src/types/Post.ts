
export interface Post {
    id: string,
    avartar?: string,
    like: Array<string>,
    likes: number,
    likeCount: number,
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