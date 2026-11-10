// app/api/auth/posts/favorite/route.ts
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/server/error/handleApiError";
import { requireUser } from "@/lib/server/auth/requireUser";
import { toPostSummaryDto } from "@/lib/server/dto/PostSummaryDto";
import { adminDb } from "@/lib/server/firebase-admin";
import { PostDoc } from "@/lib/server/dto/post";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { postsCol } from "@/lib/server/collections";

const DOCS_SIZE = 8;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { decodedUid } = auth;

  const likedCol = adminDb.collection(`users/${decodedUid}/likedPosts`);
  let query = likedCol.orderBy("createdAt", "desc").limit(DOCS_SIZE);

  try {
    if (cursor && !/^[A-Za-z0-9]{20}$/.test(cursor)) return handleApiError(400, "INVALID_CURSOR");

    if (cursor) {
      const cursorSnap = await likedCol.doc(cursor).get();
      if (!cursorSnap.exists) return handleApiError(400, "INVALID_CURSOR");
      query = query.startAfter(cursorSnap);
    }
    const likedPostsSnap = await query.get();
    const likedPostsRefs = likedPostsSnap.docs.map((d) => postsCol().doc(d.id));
    const snaps = likedPostsRefs.length
      ? await adminDb.getAll(...likedPostsRefs)
      : [];

    const items = snaps
      .filter((s) => s.exists)
      .map((s) => toPostSummaryDto(s as QueryDocumentSnapshot<PostDoc>));

    return NextResponse.json({
      items,
      nextCursor:
        likedPostsSnap.docs.length < DOCS_SIZE
          ? null
          : likedPostsSnap.docs.at(-1)!.id,
    });
  } catch (e) {
    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
  }

  //   const snap = await query.get();
}
