import { getSessionValue } from "@/lib/auth/getSessionValue";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSessionValue();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const decode = await verifySessionCookie(session);
  if (!decode)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await adminAuth.getUser(decode.uid);
  await adminDb.doc(`/users/${decode.uid}`).set({
    displayName: user.displayName,
    photoURL: user.photoURL,
    updatedAt: Date.now(),
  })

  return NextResponse.json({ message: "Authorized" }, { status: 200 });
}
