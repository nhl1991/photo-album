'use client'
import { Unsubscribe } from "firebase/firestore";
import { createContext } from "react";
// Unsubscribe는 그냥 () => void 로 같으니 통일해도 됨


export const UnsubRefContext = createContext<React.RefObject<Unsubscribe | null>|null>(null);
