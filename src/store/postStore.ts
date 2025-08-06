import { iPost } from "@/types/interface";
import { create } from "zustand";


interface postState {
    posts: iPost[];
}

interface postAction {
    setPosts: (posts: iPost[]) => void
}

export const usePostStore = create<postState&postAction>((set)=>({
    posts: [],
    setPosts: (posts) => set({posts})
}))