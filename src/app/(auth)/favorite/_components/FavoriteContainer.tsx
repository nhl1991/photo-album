"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PhotoPost from "@/components/common/PhotoPost";
import PostsWrapper from "@/components/common/ui/PostsWrapper";
import { QueryData } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchFavoritePost = async ({
  pageParam,
}: {
  pageParam: string | null;
}) => {
  const response = await fetch(
    `/api/auth/posts/favorite${pageParam ? `?cursor=${pageParam}` : ""}`,
  );
  // if(response.ok)
  return await response.json();
};

export default function FavoriteContainer() {
  const { data, status, hasNextPage, isFetchingNextPage, 
    fetchNextPage, } = useInfiniteQuery({
    queryKey: ["posts/favorite"],
    queryFn: fetchFavoritePost,
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => {
      if (nextCursor) return `${nextCursor}`;
      else return null;
    },
  });

  // console.log(lastRef)
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
              <p>Loading...</p>
            ) : (
              <button
                className="btn-wrap btn-hover"
                onClick={() => fetchNextPage()}
              >
                NEXT
              </button>
            )
          ) : (
            <p>end of contents...</p>
          )}
        </div>
      </div>
    );
}
