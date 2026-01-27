import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const postId = (await params).id;
  console.log(postId);
  const viewRef = adminDb.doc(`/posts/${postId}`);
  const data = await adminDb.runTransaction(async (tx) => {
    const viewSnap = await tx.get(viewRef);
    const current = viewSnap.data()?.view ?? (0 as number);

    tx.update(viewRef, {
      view: FieldValue.increment(1),
    });

    return { view: current + 1 };
  });

  return NextResponse.json({ data });
}

// 유저와 게스트 조회수 증가.
// 게스트는 조회수에 포함 X => ?
// 유저는 조회수 증가 시킴 => 쿨타임 => 쿠키에 lastViewed로 문서번호랑 시간 저장 => 검증 후 30분 이내이면 무효 => 다른 문서 클릭시 무효화후 lastview 교체
