// ModalContext.js
'use client'
import { ModalContextInterface, iPosts } from "@/app/utils/interface";
import React, { createContext, useState } from "react";

export const ModalContext = createContext({} as ModalContextInterface);

export const ModalProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [ post, setPost ] = useState<iPosts>();

    return (
        <ModalContext.Provider value={{ showModal, setShowModal, post, setPost }}>
            {children}
        </ModalContext.Provider>
    );
};
