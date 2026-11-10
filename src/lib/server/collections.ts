// src/lib/server/collections.ts
import "server-only";
import { FirestoreDataConverter } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { PostDoc } from "./dto/post";

const postConverter: FirestoreDataConverter<PostDoc> = {
  toFirestore: (p) => p,
  fromFirestore: (snap) => snap.data() as PostDoc, // 타입 단언은 이 한 곳에서만
};

export const postsCol = () => adminDb.collection("posts").withConverter(postConverter);
