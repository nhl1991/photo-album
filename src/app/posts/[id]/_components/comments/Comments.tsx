import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

// view, input
export default function Comments({ postId }: { postId: string }) {
  return (
    <>
      <CommentList postId={postId} />
      <CommentForm postId={postId} />
    </>
  );
}
