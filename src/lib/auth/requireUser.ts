import { handleApiError } from "../error/handleApiError";
import { NextResponse } from "next/server";
import { getUserOptional } from "./getUserOptional";
type RequireUserResult =
  | { ok: false; response: NextResponse }
  | { ok: true; decodedUid: string };

export async function requireUser(): Promise<RequireUserResult> {
  const uid = await getUserOptional();
  if (!uid) return { ok: false, response: handleApiError(401, "Unauthorized") };
  return { ok: true, decodedUid: uid };
}
