// app/api/posts/route.ts
import { requireUser } from "@/lib/auth/requireUser";
import { handleApiError } from "@/lib/error/handleApiError";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
const DOCS_SIZE = 8;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // createdAt (string)
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { decodedUid } = auth;

  let query = adminDb
    .collection("posts")
    .where("author.uid", "==", decodedUid)
    .orderBy("createdAt", "desc");

  if (cursor !== null && cursor !== undefined) {
    query = query.startAfter(Number(cursor));
  }
  
  try {
    const snap = await query.get();

    const docs = snap.docs;
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
