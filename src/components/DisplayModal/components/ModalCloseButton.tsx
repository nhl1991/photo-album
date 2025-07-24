import { Dispatch, SetStateAction } from "react";

export default function ModalCloseButton({ setShowModal }: { setShowModal: Dispatch<SetStateAction<boolean>> }) {
    const onClose = () => {
        setShowModal(false);
    }

    return (
        <button className="h-full p-1 cursor-pointer" name="close-btn" onClick={onClose}>
            <svg className="h-full" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
    )
}