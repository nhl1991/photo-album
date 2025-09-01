import { create } from "zustand";

interface State {
    displayName: string | null
}

interface Action {
    setDisplayName: (value: string) => void;
}


export const useDisplayNameStore = create<State&Action>((set) => ({
    displayName: '',
    setDisplayName: (value) => set({displayName: value})
}))