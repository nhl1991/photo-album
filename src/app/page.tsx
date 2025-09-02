"use client";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { auth, db } from "./firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  DocumentData,
  endBefore,
  getCountFromServer,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
} from "firebase/firestore";
import Upload from "@/components/UploadModal/UploadComponent";
import TimelineWrapper from "@/components/TimelineWrapper";
import Timeline from "@/components/Timeline";
import { usePostStore } from "@/store/postStore";
import { FirebaseError } from "firebase/app";
import { UnsubRefContext } from "@/components/contexts/unsubscribeContext";
import { useDisplayNameStore } from "@/store/displayNameStore";

export default function Home() {
  const pageSize = 10;
  const route = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const unsubRef = useContext(UnsubRefContext);
  const firstDocRef = useRef<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const lastDocRef = useRef<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);

  const { posts, setPosts } = usePostStore();
  const orderOptions: { [key: string]: string } = {
    createdAt: "시간순",
    likes: "좋아요",
    view: "조회수",
  };
  const [sort, setSort] = useState<string>("createdAt");
  const [q, setQ] = useState<Query<DocumentData, DocumentData>>(
    query(
      collection(db, "posts"),
      orderBy(`${sort}`, "desc"),
      limit(pageSize)
    )
  );
  const { setDisplayName } = useDisplayNameStore();
  const onModalHandler = useCallback(() => {
    setIsUploading(true);
  }, [isUploading]);
  const handleOnPrev = () => {
    console.log("onPrev ", firstDocRef.current?.data().title);
    setQ(
      query(
        collection(db, "posts"),
        orderBy(`${sort}`, "desc"),
        endBefore(firstDocRef.current),
        limitToLast(pageSize)
      )
    );
    if (pageIndex === 1) return;
    setPageIndex((prev) => prev - 1);
  };

  const handleOnNext = () => {
    setQ(
      query(
        collection(db, "posts"),
        orderBy(`${sort}`, "desc"),
        startAfter(lastDocRef.current),

        limit(pageSize)
      )
    );
    if (pageIndex === totalPage) return;
    setPageIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await auth.authStateReady();
        const agg = await getCountFromServer(query(collection(db, "posts")));
        const total = agg.data().count;

        const totalPages = Math.ceil(total / pageSize);
        setTotalPage(totalPages);
        if (!auth.currentUser) route.push("/signin");
        if (auth.currentUser && auth.currentUser.displayName) {
          setDisplayName(auth.currentUser.displayName);
        }
      } catch (err) {
        console.log(err);
      }
      //wait for firebase

      // if (!auth.currentUser)
    };

    init();

    if (!unsubRef) return;

    const fetchPosts = async () => {
      unsubRef.current = onSnapshot(
        //query
        q,
        //onNext
        (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
          if (snapshot.empty) return; // empty = true
          firstDocRef.current = snapshot.docs[0];
          lastDocRef.current = snapshot.docs[snapshot.size - 1];

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

        //onError
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
  }, [route, sort, setPosts, unsubRef, q]);

  return (
    <div className="w-[100vw] h-max col-span-full row-[2/-1] p-2 ">
      <section className="w-full h-max overflow-scroll">
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

        <div className="w-full flex items-center justify-end active:outline-0">
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
        <div className="w-full h-full relative flex ">
          <div className="w-6 md:w-12 flex items-center justify-center">
            {pageIndex != 1 ? (
              <button onClick={handleOnPrev}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-full"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L6.31 10l3.72-3.72a.75.75 0 1 0-1.06-1.06L4.72 9.47Zm9.25-4.25L9.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L11.31 10l3.72-3.72a.75.75 0 0 0-1.06-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : null}
          </div>
          <TimelineWrapper>
            <Timeline posts={posts} />
          </TimelineWrapper>
          <div className="w-6 md:w-12 flex items-center justify-center">
            {pageIndex != totalPage ? (
              <button onClick={handleOnNext}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-full"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : null}
          </div>
          {/* {index <= max ? (
            <div className="w-full h-max flex items-center justify-center bg-red-600">
              <div className="px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-xl cursor-pointer">
                <button onClick={handleShowMore}>Show More</button>
              </div>
            </div>
          ) : null} */}
        </div>
      </section>
    </div>
  );
}
