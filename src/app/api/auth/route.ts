import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionCookie = (await cookies()).get("firebase_auth");
  const tokenId = sessionCookie ? sessionCookie.value : null;
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" });
  if (!tokenId) return NextResponse.json({ error: "Unauthorized" });
  // checkRevoked: false 간단 만료만 확인. true 토큰 유효 검증
  return await adminAuth
    .verifyIdToken(tokenId)
    .then((res) => {
      return NextResponse.json(res);
    })
    .catch(() => {
      return NextResponse.json({ error: "Unauthorized" });
    });
}
