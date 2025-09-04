
import { iPost } from "../types/interface";
import LikeButton from "./buttons/LikeButton";
import View from "./buttons/ViewComponent";
import { TimeConverter } from "../utils/time-conversion";
import CommentIndicator from "./buttons/CommentIndicator";
import { useDisplayModalStore } from "@/store/modalStore";
import DisplayModalContainor from "./DisplayModal/DisplayModalContainer";
import { useMemo, useRef } from "react";
import ImageSection from "./ImageSection";



export default function Post({ posts }: {
    posts: iPost[]
}) {
    const { isDisplaying, setIsDisplaying, selectedPostId, setSelectedPostId } = useDisplayModalStore();
    const articleRef = useRef<HTMLElement|null>(null)
    const onClick = (value: iPost) => {
        setIsDisplaying(true);
        setSelectedPostId(value.id);
    }
    const post = useMemo(() => {
        return posts.find(p => p.id === selectedPostId);
    }, [selectedPostId, posts]);
    console.log(posts.length)
    return (
        <>
            {isDisplaying && post ? <DisplayModalContainor post={post} /> : null}
            {
                posts.map((post, idx) => {
                    return <article ref={articleRef} key={post.id} className="w-full h-full flex flex-col relative  hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={() => onClick(post)}  >
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 ">
                            <ImageSection {...post} isPriority={idx < 2 ? true: false}/>
                            {/* <TitleWithAuthor title={post.title} username={post.username} /> */}
                        </div>
                        <div className="flex items-center justify-center p-2">

                                <LikeButton id={post.id} like={post.like} length={post.likes} />
                                <View view={post.view} />
                                <CommentIndicator length={post.comments ? post.comments.length : 0} />
                                <p className="text-white/50">{TimeConverter(post.createdAt)}</p>
                            </div>

                        {/* <div className="w-full flex md:flex-col justify-center items-center gap-1">
                            <div className="flex">
                            </div>
                            
                        </div> */}
                    </article>

                })

            }


        </>
    )
}

