import {
  DocumentReference,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  Query,
  DocumentData,
  increment,
} from "firebase/firestore";

import { Comment, iPostsParams } from "../types/interface";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

export async function FirebaseAuthSignIn(email: string, password: string) {
  return await setPersistence(auth, browserSessionPersistence).then(() => {
    return signInWithEmailAndPassword(auth, email, password).then(
      (u) => u.user
    );
  });
}

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

export async function updateDatabase(
  reference: DocumentReference,
  data: iPostsParams,
) {
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
export async function updateView(reference: DocumentReference) {
  if (reference instanceof DocumentReference)
    try {
      await updateDoc(reference, { view: increment(1) });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  else return;
}

//this function will get modifed array of liked user list.
export async function updateLike(
  reference: DocumentReference,
  like: Array<string> | null,
) {
  const likeCount = like ? like.length : 0;

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
export async function updateComment(
  reference: DocumentReference,
  uid: string,
  displayName: string,
  comment: string,
  createdAt: number,
) {
  if (reference instanceof DocumentReference)
    try {
      await updateDoc(reference, {
        comments: arrayUnion({ uid, displayName, comment, createdAt }),
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  else return;
}

export async function deleteComment(
  reference: DocumentReference,
  comments: Comment[],
  index: number,
) {
  if (reference instanceof DocumentReference)
    try {
      await updateDoc(reference, { comments: arrayRemove(comments[index]) });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  else return;
}

export async function Logout() {
  await auth.signOut();
}

export function printErrorMessage(error: FirebaseError) {
  /**
   * FirebaseError : { code: string, name:string, message:string, stack?: string}
   */
  const message = error.code;

  return message.split("/")[1].replaceAll("-", " ");
}

export async function fetchPostByQuery(q: Query<DocumentData, DocumentData>) {
  return onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        const {
          like,
          likes,
          view,
          createdAt,
          description,
          image,
          title,
          userId,
          username,
          address,
          comments,
          avartar,
        } = doc.data();

        return {
          createdAt,
          comments,
          description,
          like,
          likes,
          view,
          image,
          title,
          userId,
          username,
          address,
          id: doc.id,
          avartar,
        };
      });
      return posts;
    },
    (error: FirebaseError) => {
      console.log(error, "=> Permission-denied due to Sign Out.");
      return;
    },
  );
}
