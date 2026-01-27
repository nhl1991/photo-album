import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const postId = (await params).id;
  const session = (await cookies()).get("session");
  let liked = false;

  const doc = await adminDb.doc(`/posts/${postId}`).get();
  // console.log(doc.data());
  const id = doc.id;
  const post = doc.data();

  if (session) {
    const tokenId = session.value;
    const decode = await verifySessionCookie(tokenId);

    if (decode) {
      const userId = decode.uid;
      const likeDoc = await adminDb
        .doc(`/posts/${postId}/likes/${userId}`)
        .get();
      if (likeDoc.exists) liked = true;
    }
  }

  return NextResponse.json({ id, post, liked });
}
