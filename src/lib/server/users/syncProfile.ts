// src/lib/server/users/syncProfile.ts
import "server-only";
import { adminAuth, adminDb } from "../firebase-admin";
export async function syncProfile(uid: string) {
  const { displayName, photoURL } = await adminAuth.getUser(uid);
  await adminDb.doc(`users/${uid}`).set(
    { displayName: displayName ?? null, photoURL: photoURL ?? null },
    { merge: true },
  );
}
