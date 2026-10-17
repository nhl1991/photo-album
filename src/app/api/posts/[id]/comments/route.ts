import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { FieldValue } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// CREATE
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // content validation
  const { content } = await req.json();

  if (typeof content !== "string" || content.length === 0) {
    return NextResponse.json(
      { ok: false, error: "INVALID_CONTENT" },
      { status: 400 },
    );
  }
  // get post id
  const postId = (await params).id;

  // get session from server
  const session = (await cookies()).get("session");
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // extract token from session
  const tokenId = session.value;

  // decoding token
  const decode = await verifySessionCookie(tokenId);
  if (!decode)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const user = await adminAuth.getUser(decode.uid);

    const { displayName, photoURL } = user;

    const commentRef = adminDb.collection(`/posts/${postId}/comments/`).doc();
    // displayName 클라이언트는 Anonymous로 표시, DB는 null로 저장
    await commentRef.create({
      content,
      uid: decode.uid,
      displayName: displayName ?? null,
      photoURL: photoURL ?? null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    if ((err as { code?: string }).code === "auth/user-not-found")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }

}

// READ
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const postId = (await params).id;
  let query = adminDb
    .collection(`posts/${postId}/comments`)
    .orderBy("createdAt", "asc")
    .limit(10);
  if (cursor !== null && cursor !== undefined) {
    query = query.startAfter(Number(cursor));
  }
  const session = (await cookies()).get("session");
  const decoded = session ? await verifySessionCookie(session.value) : null;
  const viewerUid = decoded?.uid ?? null;

  const docs = (await query.get()).docs;
  let lastDoc;
  if (docs.length < 10) lastDoc = null;
  else lastDoc = docs.at(-1);
  const raw = lastDoc ? lastDoc.get("createdAt") : null;
  const comments = docs.map((d) => {
    const { uid, photoURL, content, displayName } = d.data() as {
      uid: string;
      photoURL: string | null;
      content: string;
      displayName: string | null;
    };


    return {
      photoURL,
      content,
      displayName,
      isMine: viewerUid ? viewerUid === uid : false,
      // 필요하면 commentId도
      id: d.id,
    };
  });

  // 로그인 여부 => session uid == comment.uid

  return NextResponse.json({
    comments: comments ?? [],
    nextCursor: raw ? raw.toString() : null,
  });
}

// UPDATE
export async function PATCH() { }
