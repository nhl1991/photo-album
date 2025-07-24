import { useContext, useEffect } from "react";
import { ModalContext } from "./components/ModalContext";


export default function ModalWrapper({ children }: {
    children: React.ReactNode
}) {

    const { showModal, setShowModal } = useContext(ModalContext);


    const onClick = () => {

        setShowModal(false);

    }

    useEffect(() => {
        if (showModal)
            document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'auto' };
    }, [showModal])

    return (
        <div className="w-[100lvw] h-[100lvh] bg-white/30 fixed top-0 left-0 flex items-center justify-center rounded-2xl z-50" onClick={onClick}>
            {children}
        </div>
    )
}