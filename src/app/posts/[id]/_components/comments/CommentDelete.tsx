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
    const confirm = window.confirm("Delete this comment?");
    if (!confirm) return;
    setLoading(true);
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (response.ok) {
      queryClient.invalidateQueries({
        queryKey: [`${postId}/comments`],
      });
    } else return alert("Failed to delete the comment. Try again.");
  };

  return (
    <button id={commentId} onClick={handleOnClick}>
      {loading ? <SixDotsRotate className="w-6" /> :<DeleteIcon className="w-6 hover:stroke-red-500 cursor-pointer" />}
    </button>
  );
}
