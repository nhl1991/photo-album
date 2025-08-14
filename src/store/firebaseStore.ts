
import { Unsubscribe } from "firebase/firestore";
import { create } from "zustand";

interface State{
    unsubscribe: Unsubscribe | null
}
interface Action {
    setUnsubscribe: (value:Unsubscribe) => void;
}

export const useFirebaseStore = create<State&Action>((set) => ({
    unsubscribe: null,
    setUnsubscribe: (value) => set({ unsubscribe: value })
}))
