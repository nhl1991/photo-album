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
      alert("Failed to delete the comment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <SixDotsRotate className="w-6" />
      ) : (
        <button id={commentId} onClick={handleOnClick}>
          <DeleteIcon className="w-6 hover:stroke-red-500 cursor-pointer" />
        </button>
      )}
    </>
  );
}
