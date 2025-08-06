import { iPost } from "@/types/interface";
import CommentComponent from "./components/CommentComponent";
import ImageSection from "./components/ImageSection";
import PostHeaderActions from "./components/PostHeaderActions";
import ModalWrapper from "./ModalWrapper";
import Author from "./ui/Authors";
import PostAddress from "./ui/PostAddress";
import PostDescription from "./ui/PostDescription";
import PostTitle from "./ui/PostTitle";
import { useDisplayModalStore } from "@/store/modalStore";
import { MouseEvent, useEffect, useRef } from "react";
import { getDatabaseRefById, updateView } from "@/utils/firebase-utils";

export default function DisplayModalContainor({ post }: { post: iPost }) {

    const { setIsDisplaying } = useDisplayModalStore();


    const { title, id, userId, image, avartar, username, like, likes, view, address, description, comments } = post;

    const idRef = useRef(id);
    const viewRef = useRef(view);
    useEffect(() => {

        const currentView = viewRef.current + 1;
        const ref = getDatabaseRefById(idRef.current);
        updateView(ref, currentView);
        // const currentView = view + 1;

        // const ref = getDatabaseRefById(id);
        // updateView(ref, currentView);
    }, [])

    return (
        <div className="w-max h-max overflow-scroll" onClick={() => {
            setIsDisplaying(false)
        }}>{/** Outer */}
            <ModalWrapper>
                <div className="min-w-[90lvw] h-[90lvh] rounded-2xl grid grid-cols-6 grid-rows-10 bg-black text-white relative gap-1 p-2" onClick={(e: MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                }} >
                    {/* TOP */}
                    <div className="col-span-full md:col-[1/7] grid grid-cols-5 row-[1/2] w-full h-full">
                        <div className="col-span-4 flex items-center justify-center">
                            <PostTitle title={title} />
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                            <PostHeaderActions id={id} userId={userId} image={image} />
                        </div>
                    </div>

                    {/* IMAGE - BOTTOM RIGHT  */}
                    <div className="col-span-full md:col-span-4 row-[2/5] md:row-[2/10] px-4 py-2">
                        <ImageSection image={image} />
                    </div>
                    {/* TEXT - BOTTOM LEFT */}
                    <div className="col-[1/7] row-[5/-1] md:col-[5/7] md:row-span-8 grid grid-rows-8 bg-gray-800/50 rounded-2xl px-4 py-2">
                        <div className="row-span-1">
                            <Author avartar={avartar} username={username} id={id} like={like} likes={likes} view={view} commentsCount={comments?.length} />
                        </div>
                        <div className="row-span-1">
                            <PostAddress address={address} />
                        </div>
                        <div className="row-span-2">
                            <PostDescription description={description} />
                        </div>
                        <div className="row-span-4">
                            <CommentComponent id={id} comments={comments} />
                        </div>
                    </div>
                    {/* <div className="col-[5/7] row-span-1 bg-gray-800/50 rounded-2xl px-4 py-2">
                    </div>
                    <div className="col-[5/7] row-span-2 p-4 bg-gray-800/50 rounded-2xl px-4 py-2">
                    </div>
                    <div className="col-[5/7] row-span-4 bg-gray-800/50 rounded-2xl px-4 py-2">
                    </div> */}
                </div>
            </ModalWrapper>
        </div>
    )
}