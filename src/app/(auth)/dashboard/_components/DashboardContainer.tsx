"use client";
import PhotoPost from "@/components/common/PhotoPost";
import LoadMore from "@/components/common/ui/LoadMore";
import PageHeading from "@/components/common/ui/PageHeading";
import PhotoGridSkeleton from "@/components/common/ui/PhotoGridSkeleton";
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


  const heading = (
    <div className="mb-8">
      <PageHeading title="대시보드" description="내가 올린 사진" />
    </div>
  );

  if (status === "pending")
    return (
      <>
        {heading}
        <PhotoGridSkeleton />
      </>
    );
  if (status === "error")
    return (
      <>
        {heading}
        <p role="alert" className="py-16 text-center text-sm text-danger">게시물을 불러오지 못했습니다.</p>
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
