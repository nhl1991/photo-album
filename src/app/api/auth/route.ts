import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";

export async function GET() {
  const sessionCookie = (await cookies()).get("firebase_auth");
  const tokenId = sessionCookie ? sessionCookie.value : null;
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!tokenId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // checkRevoked: false 간단 만료만 확인. true 토큰 유효 검증
  return await adminAuth
    .verifyIdToken(tokenId)
    .then((res) => {
      return NextResponse.json(res);
    })
    .catch((e) => {
      return handleApiError(401, "Unauthorized", e);
    });
}
