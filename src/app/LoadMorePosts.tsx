import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { useState } from "react";

import TimelineWrapper from "@/components/TimelineWrapper";

type LoadMorePosts = (
  lastdoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null
) => Promise<
  readonly [React.JSX.Element | null, QueryDocumentSnapshot<DocumentData, DocumentData> | null]>;

export default function LoadMorePosts<
  T extends QueryDocumentSnapshot<DocumentData, DocumentData> | null
>({
  lastDoc,
  loadMorePosts,
  children,
}: React.PropsWithChildren<{
  lastDoc: T;
  loadMorePosts: LoadMorePosts;
}>) {
  const [elements, setElements] = useState<React.JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const currentOffsetRef =
    useRef<QueryDocumentSnapshot<DocumentData, DocumentData>>(null);

  const loadMore = React.useCallback(
    (abortController?: AbortController) => {
      setLoading(true);
      loadMorePosts(currentOffsetRef.current)
        .then(([node, next]) => {
          if (abortController?.signal.aborted) return;
          if(!node) return;
          // console.log(next);
          setElements((prev) => [...prev, node]);
          if (next === null) {
            currentOffsetRef.current ??= null;
            setDisabled(true);
            return;
          }

          currentOffsetRef.current = next;
        })
        .catch((onRejected) => {
          console.log(onRejected)
        })
        .finally(() => setLoading(false));
    },
    [loadMorePosts]
  );

  useEffect(() => {
    currentOffsetRef.current = lastDoc;

    return setElements([])
  }, [lastDoc]);

  return (
    <>
      <TimelineWrapper>
        {children}
        {elements}
      </TimelineWrapper>
      <div className="flex items-center justify-center">
        <button className="bg-sky-500 hover:bg-sky-600 cursor-pointer px-4 py-2 rounded-2xl flex items-center justify-center" onClick={() => loadMore()} disabled={disabled || loading}>
          {disabled && !loading ? 'End of contents':'Show more..'}
        </button>
      </div>
    </>
  );
}
