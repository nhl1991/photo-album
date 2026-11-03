import { auth } from "@/lib/client/firebase";
export async function signOutUser() {
  await auth.signOut();
}