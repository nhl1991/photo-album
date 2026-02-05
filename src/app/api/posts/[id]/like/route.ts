import { adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const postId = (await params).id;
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie)
    return NextResponse.json({ ok: false, status: 401, error: "Unauthorized" });

  const tokenId = sessionCookie.value;
  const decode = await verifySessionCookie(tokenId);
  if (decode) {
    const userId = decode.uid;
    //   console.log(decode);
    const likeRef = adminDb.doc(`/posts/${postId}/likes/${userId}`);

    const postRef = adminDb.doc(`/posts/${postId}`);
    const userRef = adminDb.doc(`/users/${userId}/likedPosts/${postId}`); // 유저 좋아요 역방향 인덱스
    const data = await adminDb.runTransaction(async (tx) => {
      const [likeSnap, postSnap] = await Promise.all([
        tx.get(likeRef),
        tx.get(postRef),
      ]);
      const current = (postSnap.data()?.likeCount ?? 0) as number;
      if (likeSnap.exists) {
        // 이미 좋아요 → 취소
        tx.delete(likeRef);
        tx.delete(userRef);
        tx.update(postRef, { likeCount: FieldValue.increment(-1) });
        return { liked: false, length: current - 1 };
      } else {
        // 좋아요 안 함 → 생성
        tx.set(likeRef, { createdAt: FieldValue.serverTimestamp() }); // ✅ 없으면 생성됨
        tx.set(userRef, { createdAt: FieldValue.serverTimestamp() }); // ✅ 없으면 생성됨
        tx.update(postRef, { likeCount: FieldValue.increment(1) });
        return { liked: true, length: current + 1 };
      }
    });
    revalidatePath(`/posts/${postId}`);
    return NextResponse.json({ data });
  }
  return NextResponse.json({ liked: false });
}
