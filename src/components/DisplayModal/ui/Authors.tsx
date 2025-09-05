import CommentIndicator from "@/components/indicators/CommentIndicator"
import LikeButton from "@/components/buttons/LikeButton"
import View from "@/components/buttons/ViewComponent"
import Image from "next/image"

export default function Author({ avartar, username, id, like, likes, view, commentsCount }: {
    
    id: string,
    username: string,
    avartar?: string,
    like: Array<string>,
    likes: number,
    view: number,
    commentsCount?: number,
}) {

    return (
        
            <div className="w-full h-full flex justify-between px-2 py-2">
                <div className=" col-span-3 md:justify-center items-center flex">
                    <div className="w-[48px]  h-[48px] rounded-full  relative overflow-hidden">
                        {avartar ? <Image src={avartar} className="object-cover" fill alt="image" sizes="(max-width: 768px) 100vw, 33vw" /> : <svg className="w-full" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>}
                    </div>
                    <p className="w-max text-xl px-2 ">{username}</p>
                </div>
                <div className="flex px-4 py-2 items-center justify-center">
                    <LikeButton id={id} like={like} length={likes} />
                    <View view={view} />
                    <CommentIndicator length={commentsCount? commentsCount : 0} />
                </div>
            </div>
    )
}