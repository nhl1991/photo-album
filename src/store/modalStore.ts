import { iPost } from "@/types/interface";
import { create } from "zustand";


type uploadState = {
    isUploading: boolean
}

type uploadAction = {
    setIsUploading: (value: boolean) => void;

}

export const useUploadModalStore = create<uploadState & uploadAction>((set) => ({
    isUploading: false,
    setIsUploading: (value) => set({ isUploading: value })
}))


interface displayState {
    isDisplaying: boolean,
    selectedPostId: string | null,
    post: iPost | null
}
interface displayAction {
    setIsDisplaying: (value: boolean) => void
    setPost: (post: iPost) => void;
    setSelectedPostId: (id: string | null) => void;
}

export const useDisplayModalStore = create<displayState & displayAction>((set) => ({
    isDisplaying: false,
    selectedPostId: null,
    post: null,
    setIsDisplaying: (value) => set({ isDisplaying: value }),
    setPost: (value) => set({ post: value }),
    setSelectedPostId: (id) => set({ selectedPostId: id })
}))