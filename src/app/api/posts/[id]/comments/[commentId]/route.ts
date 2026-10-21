import { adminDb } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";
import { requireUser } from "@/lib/auth/requireUser";

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const { id, commentId } = await params;
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { decodedUid } = auth;

  const commentRef = adminDb.doc(`posts/${id}/comments/${commentId}`);
  const comment = (await commentRef.get()).data();

  if (!comment) return handleApiError(404, "NOT_FOUND");

  if (comment.uid !== decodedUid) return handleApiError(403, "Forbidden");

  await commentRef.delete();

  //   await adminDb.doc(`posts/${postId}/comments`)

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
