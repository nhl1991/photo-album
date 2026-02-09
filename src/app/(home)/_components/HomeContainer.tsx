"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PhotoPost from "@/components/common/PhotoPost";
import FeedEndNotice from "@/components/common/ui/FeedEndNotice";
import PostsWrapper from "@/components/common/ui/PostsWrapper";
import ThreeDotsBounce from "@/components/icons/ThreeDotsBounce";
import { QueryData } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialFetch = async ({
  pageParam,
  signal,
}: {
  pageParam: string | null;
  signal: AbortSignal;
}) => {
  const response = await fetch(
    `/api/posts${pageParam ? `?cursor=${pageParam}` : ""}`,
    {
      method: "GET",
      signal: signal,
    },
  );
  const result = await response.json();
  // ac.abort();
  return result;
};

export default function HomeContainer() {
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      retry: false,
      queryKey: ["explore"],
      queryFn: initialFetch,
      initialPageParam: null,
      getNextPageParam: ({ nextCursor }) => {
        if (nextCursor) return `${nextCursor}`;
        else return null;
      },
    });

  if (status === "pending") return <LoadingSpinner />;

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
              <ThreeDotsBounce className="w-12 h-8" />
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

  //states
}
