import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

// view, input
export default function Comments({ postId }: { postId: string }) {
  return (
    <span className="flex flex-col gap-y-4">
      <CommentList postId={postId} />
      <CommentForm postId={postId} />
    </span>
  );
}
