"use client";
import PhotoPost from "@/components/common/PhotoPost";
import Container from "@/components/common/ui/Container";
import LoadMore from "@/components/common/ui/LoadMore";
import PhotoGridSkeleton from "@/components/common/ui/PhotoGridSkeleton";
import PostsWrapper from "@/components/common/ui/PostsWrapper";
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

  const heading = (
    <div className="flex items-center gap-4 pb-6 pt-10 md:pt-12">
      <h2 className="text-sm font-medium uppercase tracking-[0.35em] text-ink md:text-base">
        Explore
      </h2>
    </div>
  );

  if (status === "pending")
    return (
      <Container>
        {heading}
        <PhotoGridSkeleton />
      </Container>
    );

  if (status === "success" && data)
    return (
      <Container>
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
      </Container>
    );

  //states
}
