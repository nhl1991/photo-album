import { getUserOptional } from "@/lib/auth/getUserOptional";
import { requireUser } from "@/lib/auth/requireUser";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";
import { FirebaseAuthError } from "firebase-admin/auth";

// CREATE
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // content validation
  const { content } = await req.json();

  if (typeof content !== "string" || content.length === 0) {
    return handleApiError(400, "INVALID_CONTENT");
  }
  // get post id
  const postId = (await params).id;

  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { decodedUid } = auth;
  try {
    const user = await adminAuth.getUser(decodedUid);

    const { displayName, photoURL } = user;

    const commentRef = adminDb.collection(`/posts/${postId}/comments/`).doc();
    // displayName 클라이언트는 Anonymous로 표시, DB는 null로 저장
    await commentRef.create({
      content,
      uid: decodedUid,
      displayName: displayName ?? null,
      photoURL: photoURL ?? null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "OK" });
  } catch (e) {
    if (e instanceof FirebaseAuthError && e.hasCode("user-not-found"))
      return handleApiError(401, "Unauthorized");
    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
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
  const viewerUid = await getUserOptional();

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
export async function PATCH() {}
