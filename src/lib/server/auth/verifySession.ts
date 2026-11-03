import "server-only";
import { FirebaseAuthError } from "firebase-admin/auth";
import { adminAuth } from "@/lib/server/firebase-admin";

export async function verifySessionCookie(tokenId: string) {
  try {
    const decode = await adminAuth.verifySessionCookie(tokenId, true);
    return decode;
  } catch (e) {
    if (e instanceof FirebaseAuthError) console.log(e);
    return null;
  }
}
