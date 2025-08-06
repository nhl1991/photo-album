import CloseIcon from "@/components/icons/CloseIcon";
import { useDisplayModalStore } from "@/store/modalStore";

export default function ModalCloseButton() {
    const { setIsDisplaying } = useDisplayModalStore();
    const onClose = () => {
        setIsDisplaying(false);
    }

    return (
        <button className="h-full cursor-pointer" name="close-btn" onClick={onClose}>
            <CloseIcon className="w-8" />
        </button>
    )
}