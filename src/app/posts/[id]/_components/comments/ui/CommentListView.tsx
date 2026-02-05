"use client";

import { Comment } from "@/types/Comment";
import Image from "next/image";
import TimeAgo from "../../ui/TimeAgo";

export default function CommentListView({ id, comment, children }: { id: string,comment: Comment, children:React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center border-2 rounded-2xl border-gray-200 p-4">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <figure className="w-8 h-8 rounded-full overflow-hidden relative">
            {comment.photoURL ? (
              <Image
                alt={`${comment.displayName} profile image`}
                src={comment.photoURL}
                className="object-cover"
                sizes="10vw"
                fill
                loading="lazy"
              />
            ) : null}
          </figure>
          <p className="font-bold text-xl">{comment.displayName}</p>
        </div>
        <div className="flex gap-x-3">{children}</div>
      </header>
      <section>
      <p className="p-2">{comment.content}</p>
      </section>
      <footer>
      </footer>
    </div>
  );
}
