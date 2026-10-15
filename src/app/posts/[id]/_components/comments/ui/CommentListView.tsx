"use client";

import { Comment } from "@/types/Comment";
import Image from "next/image";

export default function CommentListView({ id, comment, children }: { id: string,comment: Comment, children:React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center py-5">
      <header className="flex justify-between items-center">
        <div id={id} className="flex items-center gap-x-2">
          <figure className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-line">
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
          <p className="text-sm font-medium text-ink">{comment.displayName}</p>
        </div>
        <div className="flex gap-x-1">{children}</div>
      </header>
      <section>
      <p className="whitespace-pre-line pl-10 pt-1 text-sm leading-relaxed text-ink/90">{comment.content}</p>
      </section>
      <footer>
      </footer>
    </div>
  );
}
