"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PhotoPost from "@/components/common/PhotoPost";
import FeedEndNotice from "@/components/common/ui/FeedEndNotice";
import PostsWrapper from "@/components/common/ui/PostsWrapper";
import ThreeDotsBounce from "@/components/icons/ThreeDotsBounce";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import { QueryData } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";

const DOCS_SIZE = 8;

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


  const sentinelRef = useInfiniteScrollTrigger({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (status === "pending") return <LoadingSpinner />;
  if (status === "error") return <p>Error..</p>
  if (status === "success" && data)
    return (
      <div>
        {data.pages.map((page, pageIndex) => {

          return (
            <PostsWrapper key={pageIndex}>
              {page.items.map((d: QueryData, itemIndex: number) => {

                return (
                  <PhotoPost
                    item={d}
                    index={pageIndex * DOCS_SIZE + itemIndex + 1}
                    key={d.id}
                  />
                );
              })}
            </PostsWrapper>
          );
        })}
        <div ref={sentinelRef} />
        <div className="w-full flex items-center justify-center py-4">
          {hasNextPage ? (
            isFetchingNextPage ? (
                <ThreeDotsBounce className="w-12 h-8" />
            ) : (
              <button
                className="btn-wrap font-mono-ui text-xs tracking-wide bg-studio-panel border border-studio-line text-studio-text hover:border-studio-lime-deep hover:text-studio-lime cursor-pointer transition-colors"
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
