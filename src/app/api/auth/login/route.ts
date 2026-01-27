import { adminAuth } from "@/lib/firebase-admin";
import { FirebaseError } from "firebase/app";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const header = req.headers.get("Authorization");
  if (!header) return NextResponse.json("Unauthorized", { status: 401 });
  const idToken = header.split(" ")[1];
  try {
    // const decoded = await adminAuth.verifyIdToken(idToken);
    // const userId = decoded.uid;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 1000 * 60 * 60 * 24 * 5,
    });

    (await cookies()).set("session", sessionCookie, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });
  } catch (e) {
    if (e instanceof FirebaseError) console.log(e.message);
  }

  return NextResponse.json({ message: "ok" });
}
