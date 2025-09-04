import { iPost } from "@/types/interface";
import { create } from "zustand";

interface postState {
  posts: iPost[];
}

interface postAction {
  setPosts: (posts: iPost[]) => void;
  appendPosts: (posts: iPost) => void;
}

export const usePostStore = create<postState & postAction>((set) => ({
  posts: [],
  setPosts: (posts) => set((state) => ({ posts: [...state.posts, ...posts] })),
  appendPosts: (post: iPost) =>
    set((state) => ({ posts: [post, ...state.posts] })),
}));
