import "server-only";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { PostDoc } from "./post";

export function toPostDetailDto(snap: DocumentSnapshot<PostDoc>) {
  const post = snap.data();
  if (!post) return null; // 문서가 없을 때 (호출 전에 exists로 걸렀다면 실행되지 않음)
  return {
    id: snap.id,
    title: post.title,
    content: post.content ?? post.description ?? "",
    author: post.author,
    imageUrl: post.imageUrl,
    likeCount: post.likeCount,
    view: post.view,
    createdAt: post.createdAt,
    address: post.address,
  };
}
