
import { iPosts } from "../utils/interface"
import Image from "next/image"
import { MouseEvent, useEffect, useState } from "react"
import ModalWrapper from "./DisplayModal/ModalWrapper";
import CommentComponent from "./DisplayModal/components/CommentComponent";
import LikeButton from "./buttons/LikeButton";
import View from "./buttons/ViewComponent";
import { ValidateUserAuthorization, getDatabaseRefById, updateView } from "../utils/firebase-utils";
import DeleteButton from "./buttons/DeleteButton";


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
    const onClose = () => {
        setShowModal(false);

    }

    const onClickContainer = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    useEffect(() => {
    }, [])


    if (showModal)
        return <div className="w-max h-max" onClick={() => setShowModal(false)}>
            <ModalWrapper>
                <div className="w-[90lvw] h-[80lvh]  rounded-2xl grid grid-cols-6 grid-rows-10 bg-black text-white relative gap-1 p-2" onClick={onClickContainer} >
                    {/* TOP */}
                    <div className="col-span-full content-center place-self-end">
                        {ValidateUserAuthorization(userId) ? <DeleteButton id={id} userId={userId} image={image} /> : null}

                        <button className="p-1 cursor-pointer" name="close-btn" onClick={onClose}>
                            <svg className="w-8" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* IMAGE - BOTTOM RIGHT  */}
                    <div className="col-span-4 row-start-2 row-span-8 ">
                        <div className="w-full h-full relative">
                            <Image className="relative" src={image} objectFit="contain" fill alt="none" />
                        </div>
                    </div>
                    {/* TEXT - BOTTOM LEFT */}
                    <div className="col-[5/7] row-span-8 grid grid-rows-10 grid-cols-3 ">
                        <div className=" col-span-full row-span-1 grid grid-cols-3 content-center">
                            <div className=" justify-center items-center flex">
                                <div className="w-[48px] h-[48px] rounded-full  relative overflow-hidden">
                                    {avartar ? <Image src={avartar} fill objectFit="cover" alt="image" sizes="(max-width: 128px)" /> : <svg className="w-full" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>}
                                </div>
                                <p className="w-max text-xl px-2 ">{username}</p>
                            </div>
                            <div className="col-start-4 flex">
                                <LikeButton id={id} like={like} length={likes} />
                                <View view={view} />
                            </div>
                        </div>
                        <div className=" col-span-full row-span-1 content-center">
                            {address ? <div className="w-full flex p-1">
                                <svg className="w-6" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <p className="w-max text-left px-2 my-1 text-[12px] relative">
                                    {address}</p></div> : null}
                        </div>
                        <div className=" col-span-full row-span-3 p-4">
                            <p className="w-max font-bold bg-gray-600 rounded my-1 px-2 text-white">{title}</p>
                            <p className="w-full h-full px-4 my-1 text-white">{description}</p>
                        </div>
                        <div className="col-span-full row-span-3 ">
                            <CommentComponent id={id} comments={comments} />

                        </div>
                        {/* <div id="info-text" className="w-full rows-[2/4] flex py-2 col-full ">
                    

                </div>
                <div className="col-span-4 bg-amber-200">
                    
                </div> */}
                    </div>

                </div>
            </ModalWrapper>
        </div>

    else
        return (
            <>
                <div className="w-full h-full p-2 relative hover:scale-105" onClick={onClick}>
                    <div className="w-full h-48 p-4 relative">
                        {image ? <Image className="rounded-2xl p-2 object-cover" src={image} fill sizes="(max-width: 320px)" alt={title} /> : null}
                    </div>
                </div>
            </>
        )
}
