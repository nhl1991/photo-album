
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { decodedUid } = auth;

  const user = await adminAuth.getUser(decodedUid);
  await adminDb.doc(`/users/${decodedUid}`).set({
    displayName: user.displayName,
    photoURL: user.photoURL,
    updatedAt: Date.now(),
  });

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
