"use client";
import { useEffect, useRef, useState, useCallback, ChangeEvent } from "react";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  type DocumentData,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import TimelineWrapper from "@/components/TimelineWrapper";
import Timeline from "@/components/Post";
import Upload from "@/components/UploadModal/UploadComponent";
import { iPost } from "@/types/interface";

const PAGE_SIZE = 6;

export default function Posts() {
  const orderOptions: { [key: string]: string } = {
    createdAt: "시간순",
    likes: "좋아요",
    view: "조회수",
  };

  const [posts, setPosts] = useState<iPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // 정렬/필터가 있다면 여기에 state로
  const [sort, setSort] = useState<string>("createdAt");

  // 커서(마지막 문서) – 렌더 안 일으키도록 ref 사용
  const lastDocRef = useRef<DocumentSnapshot<DocumentData> | null>(null);

  // (선택) 뒤로가기용 커서 스택
  const cursorStackRef = useRef<DocumentSnapshot<DocumentData>[]>([]);
  const onModalHandler = () => {
    setIsUploading(true);
  };
  const buildBaseQuery = useCallback(() => {
    return query(
      collection(db, "posts"),
      orderBy(sort, "desc"),
      limit(PAGE_SIZE)
    );
  }, [sort]);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const q = buildBaseQuery();
      const snap = await getDocs(q);

      const docs = snap.docs.map((d) => {
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
        } = d.data();
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
          avartar,
          id: d.id,
        };
      });
      setPosts(docs);
      setHasMore(snap.docs.length === PAGE_SIZE);

      // 커서 갱신
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null;

      // 스택 리셋
      cursorStackRef.current = [];
    } finally {
      setLoading(false);
    }
  }, [buildBaseQuery]);

  const loadNextPage = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const base = buildBaseQuery();
      const last = lastDocRef.current;
      if (!last) {
        setHasMore(false);
        return;
      }

      const q = query(base, startAfter(last));
      const snap = await getDocs(q);

      const docs = snap.docs.map((d) => {
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
        } = d.data();
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
          avartar,
          id: d.id,
        };
      });
      setPosts((prev) => [...prev, ...docs]);
      setHasMore(snap.docs.length === PAGE_SIZE);

      // 뒤로가기를 위해 이전 커서를 스택에 보관
      cursorStackRef.current.push(last);
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null;
    } finally {
      setLoading(false);
    }
  }, [buildBaseQuery, hasMore, loading]);

  // (선택) 이전 페이지 로딩 – 일반적으로는 잘 안 쓰지만 버튼 페이지네이션이면 유용
  const loadPrevPage = useCallback(async () => {
    const prevCursor = cursorStackRef.current.pop();
    if (!prevCursor) return; // 첫 페이지

    setLoading(true);
    try {
      // Firestore는 '이전 페이지' 전용 커서가 없어서
      // 일반적으로는 '첫 페이지부터 prevCursor 전까지 다시 로드' 패턴을 씀.
      // 데이터가 아주 많다면 이 방식 대신 offset-like 서버 캐시 or keyset API 설계를 고려.
      const q = buildBaseQuery();
      const snap = await getDocs(q);

      // prevCursor 직전까지 채우는 로직은 규모/요구에 맞게 커스터마이즈 필요
      // 간단 예시는 다음과 같이 리셋-재로드로 대체
      await loadFirstPage();
    } finally {
      setLoading(false);
    }
  }, [buildBaseQuery, loadFirstPage]);

  // 최초 & sort 바뀔 때 리셋
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

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
        <div className="w-full h-full flex flex-col">
          <TimelineWrapper>
            <Timeline posts={posts} />
          </TimelineWrapper>
          {hasMore && (
            <button disabled={loading} onClick={loadNextPage}>
              {loading ? "Loading..." : "Show more..."}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
