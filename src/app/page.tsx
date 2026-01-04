"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { auth, db } from "../lib/firebase";

import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Unsubscribe,
} from "firebase/firestore";
import Upload from "@/components/UploadModal/UploadComponent";
import Post from "@/components/Post";
import { useDisplayNameStore } from "@/store/displayNameStore";
import LoadMorePosts from "./LoadMorePosts";
import { iPost } from "@/types/interface";

const PAGE_SIZE = 8;
const fetchPost = (q: Query<DocumentData, DocumentData>) =>
  getDocs(q).then((res) => {
    const { docs } = res;

    const data = docs.map((doc) => {
      const {
        like,
        likes,
        view,
        createdAt,
        description,
        image,
        title,
        userId,
        username,
        address,
        comments,
        avartar,
      } = doc.data();

      return {
        like,
        likes,
        view,
        createdAt,
        description,
        image,
        title,
        userId,
        username,
        address,
        comments,
        id: doc.id,
        avartar,
      };
    });
    console.log("fetch");
    if (docs.length >= PAGE_SIZE)
      return { posts: data, offset: docs[PAGE_SIZE - 1] };
    else return { posts: data, offset: null };
  });

async function NextFetch(
  lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null
) {
  if (!lastDoc) return [null, null] as const;

  const q = query(
    collection(db, "posts"),
    orderBy(`createdAt`, "desc"),
    limit(PAGE_SIZE),
    startAfter(lastDoc)
  );

  const { posts, offset } = await fetchPost(q);

  // if(posts === undefined) return [null, null] as const;
  return [<Post posts={posts} key={posts[0].id} />, offset] as const;
}

export default function Home() {


  //states
  const [isUploading, setIsUploading] = useState(false);

  const [sort, setSort] = useState<string>("createdAt");

  //Zustand
  const { setDisplayName } = useDisplayNameStore();
  const [initialPosts, setInitialPosts] = useState<iPost[]>([]);
  const lastDocRef = useRef<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const orderOptions: { [key: string]: string } = {
    createdAt: "시간순",
    likes: "좋아요",
    view: "조회수",
  };

  const onModalHandler = useCallback(() => {
    setIsUploading(true);
  }, [setIsUploading]);

  useEffect(() => {
    let snapshotUnsub: Unsubscribe | null = null;
    let authUnsub: Unsubscribe | null = null;
    //initialize
    //fetch
    const initialize = async () => {
      try {

        const q = query(
          collection(db, "posts"),
          orderBy(`${sort}`, "desc"),
          limit(PAGE_SIZE),
          
        );
        snapshotUnsub = onSnapshot(q, (snapshot) => {
          const posts = snapshot.docs.map((doc) => {

            const {
              like,
              likes,
              view,
              createdAt,
              description,
              image,
              title,
              userId,
              username,
              address,
              comments,
              avartar,
            } = doc.data();

            return {
              id: doc.id,
              like,
              likes,
              view,
              createdAt,
              description,
              image,
              title,
              userId,
              username,
              address,
              comments,
              avartar,
            };
          });

          lastDocRef.current = snapshot.docs[PAGE_SIZE-1];
          setInitialPosts(posts);
        });
        authUnsub = onAuthStateChanged(
        auth,
        (user: User | null) => {
          if (user && auth.currentUser && auth.currentUser.displayName) {
            setDisplayName(auth.currentUser.displayName);
          } else {
            setInitialPosts([]);
          }
        },
        (err) => console.log("error : ", err)
      );
        // setInitialPosts(posts);
      } catch (err) {
        console.log("Error : ", err);
      }
    };

    initialize();
    return () => {
      
      if (snapshotUnsub) snapshotUnsub();
      if (authUnsub) authUnsub();
    };
  }, [sort, setInitialPosts, setDisplayName]);

  return (
    <main className="w-[100vw] min-h-screen  col-span-full row-[2/-1] p-2 flex flex-col items-center justify-center ">
      {isUploading ? (
        <Upload setter={setIsUploading} />
      ) : (
        <div className="w-16 h-16 rounded-full bg-sky-400/80 p-2  fixed bottom-10 right-10 z-50">
          <button
            className="hover:opacity-80  cursor-pointer "
            onClick={onModalHandler}
          >
            <svg
              className="w-full h-full"
              data-slot="icon"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="w-full h-max flex items-center justify-between active:outline-0 px-8">
        <div className=" flex items-center justify-start px-2 gap-x-12">
          <h1 className="text-[clamp(2rem,1.875rem+2vw,3rem)]" >EXPLORE</h1>
        </div>
        <select
        className=""
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setSort(e.currentTarget.value);
          }}
        >
          {Object.keys(orderOptions).map((item: string, index) => {
            return (
              <option key={index} value={item}>
                {orderOptions[item]}
              </option>
            );
          })}
        </select>
      </div>

      <LoadMorePosts loadMorePosts={NextFetch} lastDoc={lastDocRef.current}>
        <Post posts={initialPosts} key={lastDocRef.current?.data().id} />
      </LoadMorePosts>
    </main>
  );
}
