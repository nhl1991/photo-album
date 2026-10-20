import { adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";

// DELETE
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const { id, commentId } = await params;
  const session = (await cookies()).get("session");
  
  if (!session) return handleApiError(401, "Unauthorized");

  const tokenId = session.value;
  const decode = await verifySessionCookie(tokenId);

  if (!decode) return handleApiError(401, "Unauthorized");

  const commentRef = adminDb.doc(`posts/${id}/comments/${commentId}`);
  const comment = (await commentRef.get()).data();

  if (!comment) return handleApiError(404, "NOT_FOUND");

  if (comment.uid !== decode.uid) return handleApiError(401, "Unauthorized");

  await commentRef.delete();

  //   await adminDb.doc(`posts/${postId}/comments`)

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
