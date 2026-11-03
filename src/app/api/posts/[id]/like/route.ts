import { requireUser } from "@/lib/server/auth/requireUser";
import { handleApiError } from "@/lib/server/error/handleApiError";
import { adminDb } from "@/lib/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

// Firestore(gRPC) 상태 코드
const NOT_FOUND = 5;
const ALREADY_EXISTS = 6;

const getLikeRefs = (postId: string, userId: string) => ({
  likeRef: adminDb.doc(`/posts/${postId}/likes/${userId}`),
  postRef: adminDb.doc(`/posts/${postId}`),
  userRef: adminDb.doc(`/users/${userId}/likedPosts/${postId}`), // 유저 좋아요 역방향 인덱스
});

const getErrorCode = (e: unknown) => (e as { code?: number }).code;

// 좋아요. 이미 좋아요한 상태여도 성공으로 응답한다 (멱등).
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const postId = (await params).id;
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { likeRef, postRef, userRef } = getLikeRefs(postId, auth.decodedUid);

  const batch = adminDb.batch();
  batch.create(likeRef, { createdAt: FieldValue.serverTimestamp() }); // 이미 있으면 전체 실패
  batch.set(userRef, { createdAt: FieldValue.serverTimestamp() });
  batch.update(postRef, { likeCount: FieldValue.increment(1) }); // 게시물이 없으면 전체 실패
  try {
    await batch.commit();
    return NextResponse.json({ message: "OK" });
  } catch (e) {
    const code = getErrorCode(e);
    if (code === ALREADY_EXISTS) return NextResponse.json({ message: "OK" }); // 이미 좋아요한 상태
    if (code === NOT_FOUND) return handleApiError(404, "NOT_FOUND"); // 게시물 없음
    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
  }
}

// 좋아요 취소. 이미 취소된 상태여도 성공으로 응답한다 (멱등).
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const postId = (await params).id;
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { likeRef, postRef, userRef } = getLikeRefs(postId, auth.decodedUid);

  const batch = adminDb.batch();
  batch.delete(likeRef, { exists: true }); // 없으면 전체 실패
  batch.delete(userRef);
  batch.update(postRef, { likeCount: FieldValue.increment(-1) }); // 게시물이 없으면 전체 실패
  try {
    await batch.commit();
    return NextResponse.json({ message: "OK" });
  } catch (e) {
    // 이미 취소된 상태와 게시물 없음이 모두 NOT_FOUND라, 실패했을 때만 게시물 존재를 확인한다.
    if (getErrorCode(e) === NOT_FOUND) {
      const exists = (await postRef.get()).exists;
      return exists
        ? NextResponse.json({ message: "OK" })
        : handleApiError(404, "NOT_FOUND");
    }
    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
  }
}
