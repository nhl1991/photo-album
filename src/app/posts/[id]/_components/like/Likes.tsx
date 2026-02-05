"use client";

import LikeIcon from "@/components/icons/LikeIcon";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LikeCount from "./ui/LikeCount";


export default function Likes({
  postId,
  liked,
  likeCount,
}: {
  postId: string;
  liked: boolean;
  likeCount: number;
}) {
  // 초기에 한번 ${postID}/like 가져와야함
  const [like, isLike] = useState(liked);
  const [count, setCount] = useState(likeCount);
  const { user } = useAuth();
  const router = useRouter();
  const handleOnClick = async (postId: string) => {
    if (!user) return router.push("/signin");
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: "post",
      credentials: "same-origin",
    });
    if (response.ok) {
      const result = await response.json();
      const { liked, length } = result.data;
      isLike(liked);
      setCount(length)
    }
    //  const [optimisticLike, setOptimisticLike ] = useOptimistic(false, handleOnClick)
  };

  return (
    <div className="flex items-center justify-center">
      <button onClick={() => handleOnClick(postId)}>
        <LikeIcon className="w-4 md:w-8" userLike={like} />
      </button>
      <LikeCount likeCount={count} />
    </div>
  );
}
