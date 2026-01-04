import { MouseEvent } from "react";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db, storage } from "@/lib/firebase";
import DeleteIcon from "../icons/DeleteIcon";
import { useDisplayModalStore } from "@/store/modalStore";




export default function DeleteButton({ id, userId, image }: {
    id: string, // doc id
    userId: string, //userId from post.
    image: string,
}) {

    const user = auth.currentUser;
    const { setIsDisplaying } = useDisplayModalStore();
    const onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const deleteRef = ref(storage, `/posts/${id}`)
        //validation in advance.
        if (!user || !deleteRef) return;


        if (user.uid === userId) {
            //delete post and file.
            try {
                setIsDisplaying(false);
                await deleteDoc(doc(db, `posts/`, id));
                if (image) {
                    const photoRef = ref(storage, `posts/${user.uid}/${id}`);
                    await deleteObject(photoRef);
                }
            } catch (e) {
                if (e instanceof FirebaseError) {
                    console.log(e.message);
                }
            } finally {

            }
        }
    }


    return (
        <>
            <button onClick={onClickDelete} >
                <DeleteIcon className="w-8" />
            </button>
        </>
    )
}