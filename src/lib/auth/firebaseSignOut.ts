import { auth } from "../firebase";
export async function signOutUser() {
  await auth.signOut();
}