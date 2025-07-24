import { DocumentReference, arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";

import { Comment, iPostsParams } from "./interface";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/app/firebase";



export function ValidateUserAuthorization(userId: string) {
    const user = auth.currentUser;

    if (!user) return false;

    if (user.uid === userId) return true;
    else return false;
}

export function getDatabaseRefById(id: string) {
    const ref: DocumentReference = doc(db, `/posts/${id}`);

    return ref;
}

export async function updateDatabase(reference: DocumentReference, data: iPostsParams) {
    if (reference instanceof DocumentReference && data)
        try {
            await updateDoc(reference, { data });
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.log(e.message);
            }
        }
    else return;
}

//to be called when user clicks the post
export async function updateView(reference: DocumentReference, view: number) {
    if (reference instanceof DocumentReference && view)
        try {
            await updateDoc(reference, { view });
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.log(e.message);
            }
        }
    else return;
}

//this function will get modifed array of liked user list.
export async function updateLike(reference: DocumentReference, like: Array<string>|null) {
    const likeCount = like ? like.length : 0

    if (reference instanceof DocumentReference)
        try {
            await updateDoc(reference, { like, likes: likeCount });
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.log(e.message);
            }
        }
    else return;
}


export async function DeleteDocById(id: string, userId: string) {
    const ref = getDatabaseRefById(id);
    if (ValidateUserAuthorization(userId) && ref) {
        try {
            await deleteDoc(ref);

        } catch (e) {
            if (e instanceof FirebaseError) {
                console.log(e.message);
            }
        }
    }


}
export async function updateComment(reference: DocumentReference, uid: string, displayName:string, comment: string, createdAt: number) {

    if (reference instanceof DocumentReference)
        try {
            await updateDoc(reference, {comments: arrayUnion({uid, displayName, comment, createdAt})});
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.log(e.message);
            }
        }
    else return;
}

export async function deleteComment(reference: DocumentReference, comments:Comment[], index:number){

    if (reference instanceof DocumentReference)
        try {
            await updateDoc(reference, {comments: arrayRemove(comments[index])});
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.log(e.message);
            }
        }
    else return;

}



export async function Logout(){
    await auth.signOut();
}
