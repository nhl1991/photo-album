import { requireUser } from "@/lib/server/auth/requireUser";
import { handleApiError } from "@/lib/server/error/handleApiError";
import { syncProfile } from "@/lib/server/users/syncProfile";
import { FirebaseAuthError } from "firebase-admin/auth";
import { NextResponse } from "next/server";

export async function PATCH() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  try {
    await syncProfile(auth.decodedUid);
    return NextResponse.json({ message: "OK" });
  } catch (e) {
    if (e instanceof FirebaseAuthError && e.hasCode("user-not-found"))
      return handleApiError(401, "Unauthorized");
    return handleApiError(500, "INTERNAL_SERVER_ERROR", e);
  }
}
