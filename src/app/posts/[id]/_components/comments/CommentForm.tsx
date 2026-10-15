import CommentUploadIcon from "@/components/icons/CommentUploadIcon";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRef } from "react";

export default function CommentForm({ postId }: { postId: string }) {
  const commentRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const handleOnSubmit = async () => {
    if(!commentRef || !commentRef.current) return;
    const content = commentRef.current.value.trim();
    if (!content) return;
    if (!user) return;
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });
    if (response.ok) {
      queryClient.invalidateQueries({
        queryKey: [`${postId}/comments`],
      });
      commentRef.current.value= '';
    }
  };
  if (user)
    return (
      <div className="flex items-center gap-3 rounded-full border border-line-strong bg-surface py-1.5 pl-2 pr-1.5 focus-within:border-accent">
        <figure className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-line">
          {user.photoURL ? (
            <Image
              alt={`${user.displayName} profile image`}
              src={user.photoURL}
              className="object-cover"
              sizes="10vw"
              fill
              loading="lazy"
            />
          ) : null}
        </figure>
        <input
          type="text"
          className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-muted outline-none"
          name="comment"
          aria-label="Comment"
          placeholder="댓글"
          ref={commentRef}
        />
        <button
          type="submit"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-colors hover:bg-accent/90 cursor-pointer"
          aria-label="Post comment"
          name="submit"
          value="등록"
          onClick={handleOnSubmit}
        >
          <CommentUploadIcon className="w-4 h-4" />
        </button>
      </div>
    );
}
