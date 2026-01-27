"use client";
import PhotoPost from "@/components/common/PhotoPost";
import PostsWrapper from "@/components/common/ui/PostsWrapper";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { unauthorized } from "next/navigation";

interface QueryData extends Post {
  id: string;
}

const initialFetch = async ({ pageParam }: { pageParam: string | null }) => {

  const ac = new AbortController();
  const response = await fetch(
    `/api/fetchPosts${pageParam ? `?cursor=${pageParam}` : ""}`,
    {
      method: "GET",
      signal: ac.signal,
    },
  );
  const result = await response.json();
  // ac.abort();
  return result;
};

export default function HomeContainer() {
  const { user } = useAuth();
  const {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    retry: false,
    queryKey: ["explore"],
    queryFn: initialFetch,
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => {
      if (nextCursor) return `${nextCursor}`;
      else return null;
    },
  });

  // console.log(lastRef)
  if (status === "pending") return <p>Loading...</p>;

  if (status === "success" && data)
    return (
      <div>
        {data.pages.map((page, pageIndex) => {
          // console.log(page);
          return (
            <PostsWrapper key={pageIndex}>
              {page.items.map((d: QueryData) => {
                // console.log(d.title)
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
                className="px-3 py-1 rounded-xl btn-hover"
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

  //states
}
