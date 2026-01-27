"use client";

import Author from "@/components/common/ui/Author";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import PostHero from "./ui/PostHero";
import ViewCount from "./view/ui/ViewCount";
import Likes from "./like/Likes";
import PostContent from "./ui/PostContent";
import { useEffect } from "react";
import Comments from "./comments/Comments";
const fetchPost = async (postId: string) => {
  const response = await fetch(`/api/posts/${postId}`);
  const result = await response.json();
  if (response.ok) return result;
  else throw new Error("Fetch Failed.");
};
export default function PostContainer() {
  const { id } = useParams();
  if (!id) return <p>ERROR</p>;

  const postId = id?.toString();
  useEffect(() => {
    const lastViewed = localStorage.getItem(postId);
    const updateView = async () => {
      const response = await fetch(`/api/posts/${postId}/view`, {
        method: 'POST'
      })
    }
    let shouldUpdateView = false;
    if (lastViewed) {
      const last = Number(lastViewed);
      const current = Date.now();
      shouldUpdateView = last - current > 1000 * 60; // 1000 * 60 * 30 = 30 minutes
    } else {
      localStorage.setItem(postId, Date.now().toString());
      shouldUpdateView = true;
    }

    if(shouldUpdateView){
      console.log('View should be updated.')
      updateView();
    }


  }, []);
  const { data, error, status } = useQuery({
    queryKey: [`post/${id}`],
    queryFn: () => fetchPost(postId),
    retry: false,
  });
  if (status === "error" && error) return <p>Error...</p>;
  if (status === "pending") return <p>Loading...</p>;

  if (status === "success" && data) {
    const { post, liked } = data;

    return (
      <>
        <article className="w-full flex flex-col gap-y-8 lg:max-w-5xl min-h-screen">
          <header className="rounded-xl shadow-xl p-2">
            <PostHero
              image={post.image}
              address={post.address}
              createdAt={post.createdAt}
            />
          </header>
          <section className="rounded-xl shadow-xl p-2 min-h-60">
            <div className="flex justify-between items-center p-8">
              <Author
                avartar={post.avartar}
                username={post.username}
                className="w-10 h-10"
              />
              <div className="flex items-center justify-center">
                <ViewCount className="w-4 md:w-8" view={post.view} />
                <div className="flex">
                  <Likes
                    postId={postId}
                    liked={liked}
                    likeCount={post.likeCount}
                  />
                  {/* <LikeCount likeCount={post.likeCount} /> */}
                </div>
              </div>
            </div>
            <div>
              <PostContent title={post.title} body={post.description} />
            </div>
          </section>
          {/* {JSON.stringify(data)} */}
          <footer className="py-12 px-4 rounded-xl shadow-xl">
            <Comments postId={postId} />
          </footer>
        </article>
      </>
    );
  }
}
