
import { iPosts } from "../utils/interface"
import Image from "next/image"
import { MouseEvent, useEffect, useState } from "react"
import ModalWrapper from "./DisplayModal/ModalWrapper";
import { getDatabaseRefById, updateView } from "../utils/firebase-utils";
import ImageSection from "./DisplayModal/components/ImageSection";
import Author from "./DisplayModal/ui/Authors";
import PostTitle from "./DisplayModal/ui/PostTitle";
import PostHeaderActions from "./DisplayModal/components/PostHeaderActions";
import PostAddress from "./DisplayModal/ui/PostAddress";
import PostDescription from "./DisplayModal/ui/PostDescription";
import CommentComponent from "./DisplayModal/components/CommentComponent";


export default function Post(
    { id,
        avartar,
        like,
        likes,
        view,
        image,
        title,
        userId,
        description,
        username,
        address,
        comments }: iPosts,
) {
    const [showModal, setShowModal] = useState(false);
    const onClick = () => {
        setShowModal(true);

        const currentView = view + 1;
        const ref = getDatabaseRefById(id);
        updateView(ref, currentView);
    }

    const onClickContainer = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    useEffect(() => {
    }, [])


    if (showModal)
        return <div className="w-max h-max" onClick={() => setShowModal(false)}>
            <ModalWrapper>
                <div className="w-[90lvw] h-[90lvh] rounded-2xl grid grid-cols-6 grid-rows-10 bg-black text-white relative gap-1 p-2 overflow-scroll" onClick={onClickContainer} >
                    {/* TOP */}
                    <div className="col-[1/6] row-[1/2]  flex items-center justify-center">
                        <PostTitle title={title} />
                    </div>
                    <div className="col-[6/7] row-[1/2] text-white p-2">
                        <PostHeaderActions id={id} userId={userId} image={image} setShowModal={setShowModal} />
                    </div>

                    {/* IMAGE - BOTTOM RIGHT  */}
                    <div className="col-span-4 row-[2/10] px-4 py-2">
                        <ImageSection image={image} />
                    </div>
                    {/* TEXT - BOTTOM LEFT */}
                    <div className="col-[5/7] row-span-1 bg-gray-800/50 rounded-2xl px-4 py-2">
                        <Author avartar={avartar} username={username} id={id} like={like} likes={likes} view={view} commentsCount={comments?.length}/>
                    </div>
                    <div className="col-[5/7] row-span-1 bg-gray-800/50 rounded-2xl px-4 py-2">
                        <PostAddress address={address} />
                    </div>
                    <div className="col-[5/7] row-span-2 p-4 bg-gray-800/50 rounded-2xl px-4 py-2">
                        <PostDescription description={description} />
                    </div>
                    <div className="col-[5/7] row-span-4 bg-gray-800/50 rounded-2xl px-4 py-2">
                        <CommentComponent id={id} comments={comments} />
                    </div>
                </div>
            </ModalWrapper>
        </div>

    else
        return (
            <>
                <div className="w-full h-full p-1 relative hover:scale-105 hover:bg-white rounded-2xl" onClick={onClick}>
                    <div className="w-full h-48 p-1 relative">
                        {image ? <Image className="rounded-2xl object-cover" src={image} fill sizes="(max-width: 320px)" alt={title} /> : null}
                    </div>
                </div>
            </>
        )
}
