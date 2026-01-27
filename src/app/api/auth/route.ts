import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = (await cookies()).get("firebase_auth");
  if (!sessionCookie) return NextResponse.json({ok: false, status: 401, error: 'Unauthorized'});
  // checkRevoked: false 간단 만료만 확인. true 토큰 유효 검증
  return await adminAuth
    .verifyIdToken(sessionCookie?.value)
    .then((res) => {
      return NextResponse.json(res);
    })
    .catch(() => {
        return NextResponse.json({ok: false, status: 401, error: 'Unauthorized'})
    });
}
