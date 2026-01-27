"use client";

import Loading from "@/app/loading";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentListView from "./ui/CommentListView";
import { Comment } from "@/types/Comment";

const getComment = async (pageParam: string|null, postId:string) => {
  const response = await fetch(`/api/posts/${postId}/comments${pageParam ? `?cursor=${pageParam}` : ''}`, {
    method: "GET",
  });

  const data = await response.json();

  return data;
};

export default function CommentList({ postId }: { postId: string }) {
  const { data, status, error } = useInfiniteQuery({
    queryKey: [`${postId}/comments`],
    queryFn: async ({pageParam}: {pageParam:string|null}) => {
        const data = await getComment(pageParam, postId)
        return data;
    },
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => {
      if (nextCursor) return `${nextCursor}`;
      else return null;
    },
  });

  if (status === "pending") return <Loading />;
  if (status === "error") return <p>Error..</p>;
  if (status === "success" && data) return <>
  {
    data.pages.map((page)=>{
        return page.comments.map((comment : Comment)=>{
            return <CommentListView key={comment.id} comment={comment} />
        })
    })
  }
    {/* {JSON.stringify(data)} */}
  </>;
}
