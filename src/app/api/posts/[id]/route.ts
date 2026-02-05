import { getSessionValue } from "@/lib/auth/getSessionValue";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
/**
 * Get a single post.
 * @param params: Promise<{id: string}>
 * @returns A Single post.
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const postId = (await params).id;
  let liked = false;

  const doc = await adminDb.doc(`/posts/${postId}`).get();
  const id = doc.id;
  const post = doc.data();
  const authorUid = post ? post.author.uid : null;
  const tokenId = await getSessionValue();
  const decode = tokenId ? await verifySessionCookie(tokenId) : null;

  const sessionUid = decode ? decode.uid : null;
  const isMine = authorUid === sessionUid;
  const likeDoc = await adminDb
    .doc(`/posts/${postId}/likes/${sessionUid}`)
    .get();
  liked = likeDoc.exists ? true : false;

  return NextResponse.json({ id, post, liked, isMine });
}

export async function PATCH() {}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // get session from server
  const session = (await cookies()).get("session");
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tokenId = session.value;

  // decoding token
  const decode = await verifySessionCookie(tokenId);
  if (!decode)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // storage posts/{postId} 삭제
  const postId = (await params).id;
  if (!postId)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const likesRef = await adminDb.collection(`/posts/${postId}/likes`).get();
  let batch = adminDb.batch();
  let opCount = 0;

  for (const doc of likesRef.docs) {
    const likedPostRef = adminDb.doc(`users/${doc.id}/likedPosts/${postId}`);
    batch.delete(likedPostRef);
    opCount++;

    if (opCount >= 450) {
      // 여유
      await batch.commit();
      batch = adminDb.batch();
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  const filePath = (await adminDb.doc(`posts/${postId}`).get()).data();
  if (!filePath)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  // console.log(postRef);
  try {
    await adminStorage.bucket().file(filePath.imagePath).delete();
    await adminDb.doc(`/posts/${postId}`).delete();
    return NextResponse.json({ 
        code: "SUCCESS",message: "STATUS_OK" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        code: "POST_DELETE_FAILED",
        message: "Failed to delete post",
      },
      { status: 500 },
    );
  }
}
