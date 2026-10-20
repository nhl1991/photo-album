import { getSessionValue } from "@/lib/auth/getSessionValue";
import { handleApiError } from "@/lib/error/handleApiError";
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
    return handleApiError(401, "Unauthorized");
  const tokenId = session.value;

  // decoding token
  const decode = await verifySessionCookie(tokenId);
  if (!decode)
    return handleApiError(401, "Unauthorized");

  // storage posts/{postId} 삭제
  const postId = (await params).id;

  if (!postId)
    return handleApiError(404, "NOT_FOUND");
  const postData = (await adminDb.doc(`/posts/${postId}`).get()).data();

  if (!postData)
    return handleApiError(404, "NOT_FOUND");

  if (postData.author.uid !== decode.uid)
    return handleApiError(403, "Forbidden");

  const expected = `posts/${decode.uid}/${postId}`;
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

  try {
    await adminDb.doc(`/posts/${postId}`).delete();
  } catch (e) {
    return handleApiError(500, "POST_DELETE_FAILED", e);
  }

  if (postData.imagePath === expected) {
    try {
      await adminStorage
        .bucket()
        .file(expected)
        .delete({ ignoreNotFound: true });
    } catch (err) {
      // 게시물은 삭제됨 -> 성공 응답 유지, 이미지는 고아 파일로 남음
      console.error("[posts] image cleanup failed", expected, err);
    }
  }
  return NextResponse.json(
    {
      code: "SUCCESS",
      message: "STATUS_OK",
    },
    { status: 200 },
  );
}
