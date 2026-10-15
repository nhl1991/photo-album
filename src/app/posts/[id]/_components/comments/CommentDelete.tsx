import DeleteIcon from "@/components/icons/DeleteIcon";
import SixDotsRotate from "@/components/icons/SixDotsRotate";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function CommentDelete({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const handleOnClick = async () => {
    const confirm = window.confirm("이 댓글을 삭제할까요?");
    if (!confirm) return;
    try {
      setLoading(true);
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        queryClient.invalidateQueries({
          queryKey: [`${postId}/comments`],
        });
      }
    } catch (e) {
      console.log(e);
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <span role="status" aria-label="삭제 중" className="inline-flex h-10 w-10 items-center justify-center text-accent">
          <SixDotsRotate className="w-5" />
        </span>
      ) : (
        <button id={commentId} onClick={handleOnClick} className="icon-btn hover:text-danger" aria-label="댓글 삭제">
          <DeleteIcon className="w-5" />
        </button>
      )}
    </>
  );
}
