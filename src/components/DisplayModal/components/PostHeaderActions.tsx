import DeleteButton from "@/components/buttons/DeleteButton";
import { ValidateUserAuthorization } from "@/utils/firebase-utils";
import { Dispatch, SetStateAction } from "react";
import ModalCloseButton from "./ModalCloseButton";


export default function PostHeaderActions({ id, userId, image, setShowModal }: { id: string, userId: string, image: string, setShowModal: Dispatch<SetStateAction<boolean>> }) {
    
    

    return (
        <>
            <div className="col-[6/7] row-[1/2] w-full h-full text-white flex justify-end">
                {ValidateUserAuthorization(userId) ? <DeleteButton id={id} userId={userId} image={image} /> : null}
                <ModalCloseButton setShowModal={setShowModal} />
            </div>
        </>
    )
}