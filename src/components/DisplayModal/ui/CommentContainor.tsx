import { useEffect, useRef, useState } from "react";


export default function CommentContainer({ comment }: { comment: string }) {
    const commentRef = useRef<HTMLParagraphElement>(null);

    const [isOverflow, setIsOverflow] = useState<boolean>();
    const [folded, setFolded] = useState<boolean>(true);

    useEffect(() => {
        if (commentRef.current) {
            setIsOverflow(commentRef.current.scrollHeight > commentRef.current.clientHeight)

        }
    }, [])

    return (
        <>
            <p ref={commentRef} className="max-w-[42rem] ">{comment}
            </p>
            {isOverflow ? <button className={`${folded ? 'text-blue' : 'text-red'}`} onClick={()=> setFolded(!folded)}>{folded ? 'Show more' : 'Show less'}</button> : null}
        </>
    )
}