import 'server-only'
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { PostDoc } from "./post";

export function toPostSummaryDto(snap: QueryDocumentSnapshot<PostDoc>) {
  const p = snap.data();
  return { id: snap.id, title: p.title, imageUrl: p.imageUrl,
           likeCount: p.likeCount, view: p.view, authorUid: p.author.uid };
}
