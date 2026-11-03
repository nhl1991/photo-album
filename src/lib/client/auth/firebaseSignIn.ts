import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/client/firebase";

 
export async function signInUser(email: string, password: string) {
  return await setPersistence(auth, browserSessionPersistence).then(() => {
    return signInWithEmailAndPassword(auth, email, password).then(
      (u) => u.user,
    );
  });
}