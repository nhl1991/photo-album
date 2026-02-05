import { adminDb } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, commentId: string }> },
) {
  const {id, commentId} = (await params);
  const session = (await cookies()).get('session');
  if(!session) return NextResponse.json({error:"Unauthorized"}, {status: 401});

  const tokenId = session.value;
  const decode = await verifySessionCookie(tokenId);
  if(!decode) return NextResponse.json({error:"Unauthorized"}, {status: 401});
  const commentRef = adminDb.doc(`posts/${id}/comments/${commentId}`)
  const comment = (await commentRef.get()).data();
  if(!comment) return NextResponse.json({error:"NOT_FOUND"}, {status: 404});
  if(comment.uid !== decode.uid) return NextResponse.json({error:"Unauthorized"}, {status: 401});
    (await commentRef.delete())

//   await adminDb.doc(`posts/${postId}/comments`)

    return NextResponse.json({message: 'SUCCESS'}, {status: 200})

}