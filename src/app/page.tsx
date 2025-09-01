"use client";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Upload from "@/components/UploadModal/UploadComponent";
import TimelineWrapper from "@/components/TimelineWrapper";
import Timeline from "@/components/Timeline";
import { usePostStore } from "@/store/postStore";
import { FirebaseError } from "firebase/app";
import { UnsubRefContext } from "@/components/contexts/unsubscribeContext";
import { useDisplayNameStore } from "@/store/displayNameStore";

export default function Home() {
  const route = useRouter();

  const [isUploading, setIsUploading] = useState(false);

  const unsubRef = useContext(UnsubRefContext);
  // const [posts, setPosts] = useState<iPost[]>([])
  // <boolean & Dispatch<SetStateAction<boolean>>>({showModal, setShowModal});

  const { posts, setPosts } = usePostStore();
  const orderOptions: { [key: string]: string } = {
    createdAt: "시간순",
    likes: "좋아요",
    view: "조회수",
  };
  const [sort, setSort] = useState<string>("createdAt");
  const { setDisplayName } = useDisplayNameStore();
  const onModalHandler = () => {
    setIsUploading(true);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await auth.authStateReady();

        if (!auth.currentUser) route.push("/signin");
        if(auth.currentUser && auth.currentUser.displayName)
          setDisplayName(auth.currentUser.displayName);
      } catch (err) {
        console.log(err);
      }
      //wait for firebase

      // if (!auth.currentUser)
    };

    init();
    // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
    // onAuthStateChanged(nextOrObserver : Observer<any> | ((a: User | null) => any), error ? : (a: Error) => any, completed ? : firebase.Unsubscribe) : firebase.Unsubscribe
    // let unsubscribe: Unsubscribe | null = null

    if (!unsubRef) return;

    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy(`${sort}`, "desc"),
        limit(25)
      );

      unsubRef.current = onSnapshot(
        postsQuery,
        (snapshot) => {
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
              createdAt,
              comments,
              description,
              like,
              likes,
              view,
              image,
              title,
              userId,
              username,
              address,
              id: doc.id,
              avartar,
            };
          });
          setPosts(posts);
        },
        (error: FirebaseError) => {
          console.log(error, "=> Permission-denied due to Sign Out.");
          return;
        }
      );
    };
    // fetchPosts();

    return onAuthStateChanged(auth, (user: User | null) => {
      if (user) fetchPosts();
      else if (unsubRef) unsubRef.current?.();
    });
  }, [route, sort, setPosts, unsubRef]);

  return (
    <div className="w-[100vw] h-full col-span-full row-[2/-1] px-12 py-4 ">
      <section className=" h-full overflow-scroll">
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

        <div className="w-full flex items-center justify-end px-4 py-2 active:outline-0">
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              console.log(e.currentTarget.value);
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
        <TimelineWrapper>
          <Timeline posts={posts} />
        </TimelineWrapper>
      </section>
    </div>
  );
}
