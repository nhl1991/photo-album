export interface QueryData extends Post {
  id: string;
}
export interface Post {
    id: string,
    author: {
      photoURL: string,
      uid: string,
      displayName: string
    }
    like: Array<string>,
    likes: number,
    likeCount: number,
    view: number,
    createdAt: number,
    imageUrl: string,
    title: string,
    description: string,
    address: string,
    comments: Comment[] | null,    
}