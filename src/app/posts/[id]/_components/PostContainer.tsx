"use client";

import Author from "@/components/common/ui/Author";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import PostHero from "./ui/PostHero";
import ViewCount from "./view/ui/ViewCount";
import Likes from "./like/Likes";
import PostContent from "./ui/PostContent";
import { useEffect } from "react";
import Comments from "./comments/Comments";
import PostDeleteButton from "./PostDeleteButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";
const fetchPost = async (postId: string) => {
  const response = await fetch(`/api/posts/${postId}`);
  const result = await response.json();
  if (response.ok) return result;
  else throw new Error("Fetch Failed.");
};
const deletePost = async (postId: string) => {
  await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
  });
};
export default function PostContainer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const postId = id;

  useEffect(() => {
    // if (!postId) return;
    const lastViewed = localStorage.getItem(postId);
    const updateView = async () => {
      await fetch(`/api/posts/${postId}/view`, {
        method: "POST",
      });
    };
    let shouldUpdateView = false;
    if (lastViewed) {
      const last = Number(lastViewed);
      const current = Date.now();
      shouldUpdateView = last - current > 1000 * 60; // 1000 * 60 * 30 = 30 minutes
    } else {
      localStorage.setItem(postId, Date.now().toString());
      shouldUpdateView = true;
    }

    if (shouldUpdateView) {
      updateView();
    }
  }, [postId]);

  const { data, error, status, isPending } = useQuery({
    queryKey: [`post/${id}`],
    queryFn: () => fetchPost(postId),
    retry: false,
    enabled: postId ? true : false,
  });
  const deleteMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => router.push("/"),
  });
  if (status === "error" && error) return <p>Error...</p>;
  if (isPending || deleteMutation.isPending) return <LoadingSpinner />;
  if (status === "success" && data) {
    const { post, liked, isMine } = data;

    return (
      <>
        <article className="w-full flex flex-col gap-y-8 lg:max-w-5xl min-h-screen">
          <header className="rounded-xl shadow-xl p-2">
            {isMine ? (
              <ul className="flex justify-between gap-x-4 px-2">
                <li className="">
                  <PostDeleteButton onDelete={deleteMutation.mutateAsync} />
                </li>
                <li>UPDATE</li>
              </ul>
            ) : null}
            <PostHero
              image={post.imageUrl}
              address={post.address}
              createdAt={post.createdAt}
            />
          </header>
          <section className="rounded-xl shadow-xl p-2 min-h-60">
            <div className="flex justify-between items-center p-8">
              <Author
                avartar={post.author.photoURL}
                username={post.author.displayName}
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
