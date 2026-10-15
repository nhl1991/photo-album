"use client"
import { useAuth } from "@/hooks/useAuth";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Link from "next/link";

// view, input
export default function Comments({ postId }: { postId: string }) {
  const { user } = useAuth();
  return (
    <span className="flex flex-col gap-y-6">
      <CommentList postId={postId} />
      {user ? <CommentForm postId={postId} /> : <div className="card flex flex-col items-center justify-center gap-y-4 px-6 py-8">
                <p className="text-center text-sm text-muted">댓글을 작성하려면 로그인하세요.</p>
                <Link
                  href="/signin"
                  className="btn-primary"
                >
                  로그인
                </Link>
              </div>}
      
    </span>
  );
}
