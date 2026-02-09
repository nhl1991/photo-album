import DeleteIcon from "@/components/icons/DeleteIcon";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentDelete({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const queryClient = useQueryClient();
  const handleOnClick = async () => {
    
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      queryClient.invalidateQueries({
        queryKey: [`${postId}/comments`],
      });
    } else return;
  };

  return (
    <button id={commentId} onClick={handleOnClick}>
      <DeleteIcon className="w-6 hover:stroke-red-500 cursor-pointer" />
    </button>
  );
}
