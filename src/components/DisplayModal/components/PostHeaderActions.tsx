import DeleteButton from "@/components/buttons/DeleteButton";
import { ValidateUserAuthorization } from "@/utils/firebase-utils";
import ModalCloseButton from "./ModalCloseButton";


export default function PostHeaderActions({ id, userId, image }: { id: string, userId: string, image: string  }) {
    
    

    return (
        <>
                {ValidateUserAuthorization(userId) ? <DeleteButton id={id} userId={userId} image={image} /> : null}
                <ModalCloseButton />
        </>
    )
}