

import "server-only";
import { adminDb } from "./firebase-admin";
// key : 유저, limit: 제한 횟수, windowMs: 인터벌 (밀리초)
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const ref = adminDb.doc(`rateLimits/${key}_${windowStart}`);

  const count = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const next = ((snap.get("count") as number) ?? 0) + 1;
    tx.set(ref, { count: next, expiresAt: new Date(windowStart + windowMs * 2) });
    return next;
  });

  return { ok: count <= limit, retryAfter: Math.ceil((windowStart + windowMs - Date.now()) / 1000) };
}
