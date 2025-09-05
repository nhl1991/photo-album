
import Image from "next/image"
import { useEffect, useState } from "react"
import CommentIndicator from "./indicators/CommentIndicator"
import { Comment } from "@/types/interface"
import LikeIndicator from "./indicators/LikeIndicator"
import ViewIndicator from "./indicators/ViewIndicator"


export default function ImageSection(
    {
        image,
        title,
        view,
        likes,
        comments,
        isPriority }: {
            image: string,
            title: string,
            view: number,
            likes: number,
            comments: Comment[]|null,
            isPriority: boolean
        }
) {

    const [isHover, setIsHover] = useState<boolean>(false)


    useEffect(() => {
    }, [])
    return (
        <>
            <div className="w-full h-full relative" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                <div className="w-full h-full relative " >
                    {isHover ? <div className="w-full h-full rounded-2xl bg-black/50 absolute z-50 flex items-center justify-center">
                        <div className="flex gap-2">
                            <ViewIndicator view={view} />
                            <LikeIndicator length={likes} />
                            <CommentIndicator length={comments ? comments.length : 0} />
                        </div>
                    </div> : null}
                    {image ? <Image className=" object-cover rounded-2xl" src={image} fill sizes="(max-width: 768px) 100vw, 33vw" alt={title} priority={isPriority} /> : null}
                </div>

            </div>
        </>
    )
}




