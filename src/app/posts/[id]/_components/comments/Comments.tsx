"use client"
import { useAuth } from "@/hooks/useAuth";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Link from "next/link";

// view, input
export default function Comments({ postId }: { postId: string }) {
  const { user } = useAuth();
  return (
    <span className="flex flex-col gap-y-4">
      <CommentList postId={postId} />
      {user ? <CommentForm postId={postId} /> : <div className="flex flex-col items-center justify-center gap-y-4">
                <p className="font-bold text-center">You need to sign in.</p>
                <Link
                  href="/signin"
                  className="px-3 py-1.5 rounded-2xl btn-hover font-bold"
                >
                  Sign In
                </Link>
              </div>}
      
    </span>
  );
}
