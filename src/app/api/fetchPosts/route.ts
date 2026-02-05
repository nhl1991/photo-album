// app/api/posts/route.ts
import { adminDb } from "@/lib/firebase-admin";
const DOCS_SIZE = 8;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // createdAt (string)
  let query = adminDb
    .collection("posts")
    .orderBy("createdAt", "desc")
    .limit(DOCS_SIZE);

  if (cursor !== null && cursor !== undefined) {
    query = query.startAfter(Number(cursor));
  }
  const t0 = Date.now();
  try {
    const snap = await query.get();
    console.log(
      "[posts] firestore ok",
      Date.now() - t0,
      "ms",
      "size",
      snap.size,
    );
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
    throw e;
  }

  //   const snap = await query.get();
}
