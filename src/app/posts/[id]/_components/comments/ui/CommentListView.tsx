"use client";

import { Comment } from "@/types/Comment";
import Image from "next/image";

export default function CommentListView({ comment }: { comment: Comment }) {
  return (
    <div className="flex flex-col justify-center border-2 rounded-2xl border-gray-200 p-4">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <figure className="w-8 h-8 rounded-full overflow-hidden relative">
            {comment.avatar ? (
              <Image
                alt={`${comment.username} profile image`}
                src={comment.avatar}
                className="object-cover"
                sizes="10vw"
                fill
                loading="lazy"
              />
            ) : null}
          </figure>
          <p className="font-bold text-xl">{comment.username}</p>
        </div>
        <div className="flex gap-x-3">{comment.isMine ? <><p>DELETE</p><p>EDIT</p></> : null}</div>
      </header>
      <p className="p-2">{comment.content}</p>
    </div>
  );
}
