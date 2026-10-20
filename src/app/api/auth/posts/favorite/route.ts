// app/api/posts/route.ts
import { adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";
const DOCS_SIZE = 8;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // createdAt (string)
  const session = (await cookies()).get("session");
  if (!session)
    return handleApiError(401, "Unauthorized");

  const tokenId = session.value;

  const decode = await verifySessionCookie(tokenId);
  if (!decode)
    return handleApiError(401, "Unauthorized");

  let query = adminDb
    .collection(`/users/${decode.uid}/likedPosts/`)
    .orderBy("createdAt", "desc")
    .limit(DOCS_SIZE);

  if (cursor !== null && cursor !== undefined) {
    query = query.startAfter(Number(cursor));
  }

  try {
    const likedPostsSnap = await query.get();
    const likedPostsRefs = likedPostsSnap.docs.map((d)=> adminDb.doc(`/posts/${d.id}`));
    const snap = await adminDb.getAll(...likedPostsRefs);
    
    const docs = snap;
    let lastDoc;
    if (docs.length < DOCS_SIZE) lastDoc = null;
    else lastDoc = docs.at(-1);
    const raw = lastDoc?.get("createdAt");

    return NextResponse.json({
      items: docs.map((d) => ({ id: d.id, ...d.data() })),
      nextCursor: lastDoc ? raw.toString() : null,
    });
  } catch (e) {

    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
  }

  //   const snap = await query.get();
}
