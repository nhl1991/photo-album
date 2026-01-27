import CommentUploadIcon from "@/components/icons/CommentUploadIcon";
import UploadIcon from "@/components/icons/UploadIcon";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRef } from "react";

export default function CommentForm({ postId }: { postId: string }) {
  const commentRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  console.log(user?.displayName);
  const handleOnSubmit = async () => {
    const content = commentRef.current?.value?.trim();
    if (!content) return;
    if (!user) return;
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, username: user.displayName, avatar: user.photoURL }),
    });
    queryClient.invalidateQueries({
    queryKey: [`${postId}/comments`],
    })


  };
if(user)
  return (
    <div className="flex items-center justify-center border-2 rounded-2xl border-gray-200 py-1 px-3">
        <figure className="w-8 h-8 rounded-full overflow-hidden relative">
            {user.photoURL ? <Image alt={`${user.displayName} profile image`} src={user.photoURL} className="object-cover" sizes="10vw" fill loading="lazy" /> : null}
        </figure>
      <input type="text" className="w-full px-4"  name="comment" placeholder="댓글" ref={commentRef} />
      <button type="submit" className="rounded-xl px-3 py-1 bg-sky-400" name="submit" value="등록" onClick={handleOnSubmit}><CommentUploadIcon className="w-4 h-4 stroke-white" /></button>
    </div>
  );
}
