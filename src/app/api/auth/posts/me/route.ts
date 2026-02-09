// app/api/posts/route.ts
import { handleApiError } from "@/lib/api/handleApiError";
import { ApiError } from "@/lib/error/ApiError";
import { adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const DOCS_SIZE = 8;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // createdAt (string)
  const session = (await cookies()).get("session");
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tokenId = session.value;

  const decode = await verifySessionCookie(tokenId);
  if (!decode)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let query = adminDb
    .collection("posts")
    .where("author.uid", "==", decode.uid)
    .orderBy("createdAt", "desc");

  if (cursor !== null && cursor !== undefined) {
    query = query.startAfter(Number(cursor));
  }
  const t0 = Date.now();
  try {
    const snap = await query.get();

    const docs = snap.docs;
    let lastDoc;
    if (docs.length < DOCS_SIZE) lastDoc = null;
    else lastDoc = docs.at(-1);
    const raw = lastDoc?.get("createdAt");

    return Response.json({
      items: docs.map((d) => ({ id: d.id, ...d.data() })),
      nextCursor: lastDoc ? raw.toString() : null,
    });
  } catch (e) {
    console.error("[posts] firestore fail", Date.now() - t0, "ms", e);
    handleApiError(e);
  }

  //   const snap = await query.get();
}
