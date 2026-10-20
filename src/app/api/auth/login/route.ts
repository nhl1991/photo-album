import { adminAuth } from "@/lib/firebase-admin";
import { FirebaseAuthError } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";
const INVALID_TOKEN_CODES = [
  "invalid-id-token",
  "id-token-expired",
  "user-not-found",
  "user-disabled",
];
export async function POST(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const header = req.headers.get("Authorization");
  if (!header) return handleApiError(401, "Unauthorized");
  const tokenId = header.split(" ")[1].trim();
  try {
    const sessionCookie = await adminAuth.createSessionCookie(tokenId, {
      expiresIn: 1000 * 60 * 60 * 24 * 5,
    });

    (await cookies()).set("session", sessionCookie, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });
  } catch (e) {
    if (
      e instanceof FirebaseAuthError &&
      INVALID_TOKEN_CODES.some((code) => e.hasCode(code))
    ) {
      if (e.hasCode("user-disabled"))
        return handleApiError(403, "USER_DISABLED");
      return handleApiError(401, "Unauthorized");
    }
    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
  }

  return NextResponse.json({ message: "OK" });
}
