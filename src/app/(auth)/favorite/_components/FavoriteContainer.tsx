"use client";
import PhotoPost from "@/components/common/PhotoPost";
import LoadMore from "@/components/common/ui/LoadMore";
import PageHeading from "@/components/common/ui/PageHeading";
import PhotoGridSkeleton from "@/components/common/ui/PhotoGridSkeleton";
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


  const heading = (
    <div className="mb-8">
      <PageHeading title="즐겨찾기" description="좋아요한 사진" />
    </div>
  );

  if (status === "pending")
    return (
      <>
        {heading}
        <PhotoGridSkeleton />
      </>
    );

  if (status === "success" && data)
    return (
      <>
        {heading}
        <PostsWrapper>
          {data.pages
            .flatMap((page) => page.items)
            .map((d: QueryData) => {
              return <PhotoPost item={d} key={d.id} />;
            })}
        </PostsWrapper>
        <LoadMore
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </>
    );
}
