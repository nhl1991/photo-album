import { requireUser } from "@/lib/server/auth/requireUser";
import { handleApiError } from "@/lib/server/error/handleApiError";
import { adminAuth, adminDb } from "@/lib/server/firebase-admin";
import { FirebaseAuthError } from "firebase-admin/auth";
import { NextResponse } from "next/server";

export async function PATCH() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  try {
    const { displayName, photoURL } = await adminAuth.getUser(auth.decodedUid);
    await adminDb.doc(`users/${auth.decodedUid}`).set(
      { displayName: displayName ?? null, photoURL: photoURL ?? null },
      { merge: true }, // users/{uid} 아래 likedPosts 등과 무관, 다른 필드 보존
    );
    return NextResponse.json({ message: "OK" });
  } catch (e) {
    if (e instanceof FirebaseAuthError && e.hasCode("user-not-found"))
      return handleApiError(401, "Unauthorized");
    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
  }
}
