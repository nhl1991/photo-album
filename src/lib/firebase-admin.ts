
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";


const projectId= process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail= process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
const privateKey= process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
  ?.replace(/\\n/g, "\n")   // "\n" 텍스트를 실제 줄바꿈으로
  .replace(/\r/g, "")       // Windows CR 제거
  .trim();                  // 앞뒤 공백 제거;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Missing Firebase Admin env vars");
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert( { projectId , clientEmail, privateKey} ),
        storageBucket: "gs://photo-album-by-next-js.firebasestorage.app"
      });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);