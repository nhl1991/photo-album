"use client";

import LikeIcon from "@/components/icons/LikeIcon";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
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
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState({ liked, count: likeCount });
  const [optimistic, toggleOptimistic] = useOptimistic(state, (s) => ({
    liked: !s.liked,
    count: s.count + (s.liked ? -1 : 1),
  }));
  const [isPending, startTransition] = useTransition();

  const handleOnClick = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    if (isPending) return; // 요청이 겹치지 않게 (PUT·DELETE 순서가 뒤바뀌지 않도록)
    const nextLiked = !state.liked; // props가 아니라 현재 확정 상태 기준
    startTransition(async () => {
      toggleOptimistic(undefined);
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: nextLiked ? "PUT" : "DELETE",
      }).catch(() => null);
      if (!response?.ok) return; // 실패하면 자동으로 원래대로
      const delta = nextLiked ? 1 : -1;
      startTransition(() =>
        setState((s) => ({ liked: nextLiked, count: s.count + delta })),
      );
      // 상세 쿼리 캐시도 갱신해, 페이지에 다시 들어왔을 때 예전 상태가 보이지 않게 한다.
      // (이 컴포넌트는 props를 초기값으로만 쓰므로 다시 불러온 값을 반영하지 않는다)
      queryClient.setQueryData<{ liked: boolean; post: { likeCount: number } }>(
        [`post/${postId}`],
        (old) =>
          old && {
            ...old,
            liked: nextLiked,
            post: {
              ...old.post,
              likeCount:
                old.post.likeCount + (old.liked === nextLiked ? 0 : delta),
            },
          },
      );
    });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        className={`icon-btn -ml-2 h-9 w-9 hover:text-like ${optimistic.liked ? "text-like" : "text-ink"}`}
        onClick={() => handleOnClick()}
        aria-pressed={optimistic.liked}
        aria-label="좋아요"
      >
        <LikeIcon className="w-5" userLike={optimistic.liked} />
      </button>
      <LikeCount likeCount={optimistic.count} />
    </div>
  );
}
