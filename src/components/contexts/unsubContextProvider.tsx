'use client'
import { useRef } from "react";
import { UnsubRefContext } from "./unsubscribeContext";
import { Unsubscribe } from "firebase/firestore";


export default function UnsubContextProvider({ children }: { children: React.ReactNode }){
     const unsubRef = useRef<Unsubscribe | null>(null);

    return(
        <UnsubRefContext.Provider value={unsubRef}>
            {children}
        </UnsubRefContext.Provider>

    )

}