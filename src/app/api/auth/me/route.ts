import { getSessionValue } from "@/lib/auth/getSessionValue";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";

export async function GET() {
  const session = await getSessionValue();
  if (!session)
    return handleApiError(401, "Unauthorized");
  const decode = await verifySessionCookie(session);
  
  if (!decode)
    return handleApiError(401, "Unauthorized");

  const user = await adminAuth.getUser(decode.uid);
  await adminDb.doc(`/users/${decode.uid}`).set({
    displayName: user.displayName,
    photoURL: user.photoURL,
    updatedAt: Date.now(),
  });

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
