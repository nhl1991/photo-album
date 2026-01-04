"use client";
import { Comment } from "@/types/interface";
import CommentComponent from "./components/CommentComponent";
import ImageSection from "./components/ImageSection";
import PostHeaderActions from "./components/PostHeaderActions";
import ModalWrapper from "./ModalWrapper";
import Author from "./ui/Authors";
import PostAddress from "./ui/PostAddress";
import PostDescription from "./ui/PostDescription";
import PostTitle from "./ui/PostTitle";
import { useDisplayModalStore } from "@/store/modalStore";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { getDatabaseRefById, updateView } from "@/utils/firebase-utils";
import {
  doc,
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UnsubRefContext } from "../contexts/unsubscribeContext";

type ModalPost = {
  id: string;
  avartar?: string;
  like: Array<string>;
  likes: number;
  view: number;
  image: string;
  title: string;
  userId: string;
  description: string;
  username: string;
  address: string;
  comments: Comment[] | null;
};

export default function DisplayModalContainor({
  id,
  view,
}: {
  id: string;
  view: number;
}) {
  const { setIsDisplaying } = useDisplayModalStore();
  const [modalPost, setModalPost] = useState<ModalPost>();
  const unsubRef = useContext(UnsubRefContext);

  useEffect(() => {
    if (!unsubRef || !id) return;

    const ref = getDatabaseRefById(id);
    updateView(ref);

    const docRef: DocumentReference<DocumentData> = doc(db, "posts", id);
    unsubRef.current = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const {
            title,
            id, //doc id
            userId,
            image,
            avartar,
            username,
            like,
            likes,
            view,
            address,
            description,
            comments,
          } = snapshot.data();
          setModalPost({
            title,
            id, //doc id
            userId,
            image,
            avartar,
            username,
            like,
            likes,
            view,
            address,
            description,
            comments,
          });
        }
      },
      (err) => console.log(err.message)
    );
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [id, unsubRef]);

  return (
    <div
      className="w-max h-max overflow-scroll absolute"
      onClick={() => {
        setIsDisplaying(false);
      }}
    >
      {/** Outer */}
      <ModalWrapper>
        {modalPost ? (
          <div
            className="min-w-[90lvw] h-[90lvh] rounded-2xl grid grid-cols-6 grid-rows-10 bg-black text-white relative gap-1 p-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
            {/* TOP */}
            <div className="col-span-full md:col-[1/7] grid grid-cols-5 row-[1/2] w-full h-full">
              <div className="col-span-4 flex items-center justify-center">
                <PostTitle title={modalPost.title} />
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <PostHeaderActions
                  id={id}
                  userId={modalPost.userId}
                  image={modalPost.image}
                />
              </div>
            </div>

            {/* IMAGE - BOTTOM RIGHT  */}
            <div className="col-span-full md:col-span-4 row-[2/5] md:row-[2/10] px-4 py-2">
              <ImageSection image={modalPost.image} />
            </div>
            {/* TEXT - BOTTOM LEFT */}
            <div className="col-[1/7] row-[5/-1] md:col-[5/7] md:row-span-8 grid grid-rows-8 bg-gray-800/50 rounded-2xl px-4 py-2">
              <div className="row-span-1">
                <Author
                  avartar={modalPost.avartar}
                  username={modalPost.username}
                  id={id}
                  like={modalPost.like}
                  likes={modalPost.likes}
                  view={modalPost.view}
                  commentsCount={modalPost.comments?.length}
                />
              </div>
              <div className="row-span-1">
                <PostAddress address={modalPost.address} />
              </div>
              <div className="row-span-2">
                <PostDescription description={modalPost.description} />
              </div>
              <div className="row-span-4">
                <CommentComponent id={id} comments={modalPost.comments} />
              </div>
            </div>
          </div>
        ) : null}
      </ModalWrapper>
    </div>
  );
}
