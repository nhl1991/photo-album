"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PhotoPost from "@/components/common/PhotoPost";
import FeedEndNotice from "@/components/common/ui/FeedEndNotice";
import PostsWrapper from "@/components/common/ui/PostsWrapper";
import { QueryData } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";

const getMyPosts = async ({
  pageParam,
}: {
  pageParam: string | null;
}) => {
  const response = await fetch(
    `/api/auth/posts/me${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
    if (!response.ok) {
    const payload = await response.json();
    throw new Error(payload.error ?? "UNKNOWN_ERROR");
  }
  // if(response.ok)
  return await response.json();
};

export default function DashboradContainer() {
  const { data, status, hasNextPage, isFetchingNextPage, 
    fetchNextPage, } = useInfiniteQuery({
    queryKey: ["posts/myPosts"],
    queryFn: getMyPosts,
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => {
      if (nextCursor) return `${nextCursor}`;
      else return null;
    },
  });


  if (status === "pending") return <LoadingSpinner />;
  if (status === "error") return <p>Error..</p>
  if (status === "success" && data)
    return (
      <div>
        {data.pages.map((page, pageIndex) => {

          return (
            <PostsWrapper key={pageIndex}>
              {page.items.map((d: QueryData) => {

                return <PhotoPost item={d} key={d.id} />;
              })}
            </PostsWrapper>
          );
        })}
        <div className="w-full flex items-center justify-center py-4">
          {hasNextPage ? (
            isFetchingNextPage ? (
                <LoadingSpinner />
            ) : (
              <button
                className="btn-wrap btn-hover"
                onClick={() => fetchNextPage()}
              >
                NEXT
              </button>
            )
          ) : (
            <FeedEndNotice />
          )}
        </div>
      </div>
    );
}
