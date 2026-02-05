import { getSessionValue } from "@/lib/auth/getSessionValue";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSessionValue();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const decode = await verifySessionCookie(session);
  if (!decode)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await adminAuth.getUser(decode.uid);
  console.log(user.displayName);
  console.log(user.photoURL);
  await adminDb.doc(`/users/${decode.uid}`).set({
    displayName: user.displayName,
    photoURL: user.photoURL,
    updatedAt: Date.now(),
  })

  return NextResponse.json({ message: "Authorized" }, { status: 200 });
}
