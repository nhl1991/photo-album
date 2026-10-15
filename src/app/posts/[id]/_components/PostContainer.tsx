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
import PostEditButton from "./PostEditButton";


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
  if (status === "error" && error)
    return (
      <p role="alert" className="py-24 text-center text-sm text-danger">
        Error...
      </p>
    );
  if (isPending || deleteMutation.isPending) return <LoadingSpinner />;
  if (status === "success" && data) {
    const { post, liked, isMine } = data;
    return (
      <>
        <article className="mx-auto flex w-full max-w-5xl flex-col pt-6 md:pt-10">
          <header>
            {isMine ? (
              <ul className="mb-3 flex justify-end gap-x-1">
                <li className="">
                  <PostDeleteButton onDelete={deleteMutation.mutateAsync} />
                </li>
                <li><PostEditButton onEdit={async ()=> {}}/></li>
              </ul>
            ) : null}
            <PostHero
              image={post.imageUrl}
              address={post.address}
              createdAt={post.createdAt}
            />
          </header>
          <section className="mx-auto w-full max-w-3xl pt-8 md:pt-12">
            <div className="min-h-24">
              <PostContent title={post.title} body={post.content ?? post.description} />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
              <Author
                avartar={post.author.photoURL}
                username={post.author.displayName}
                className="w-10 h-10"
              />
              <div className="flex items-center gap-5 text-sm text-muted">
                <ViewCount className="w-5" view={post.view+1} />
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
          </section>
          {/* {JSON.stringify(data)} */}
          <footer className="mx-auto w-full max-w-3xl pt-12">
            <h2 className="eyebrow mb-4">Comments</h2>
            <Comments postId={postId} />
          </footer>
        </article>
      </>
    );
  }
}
