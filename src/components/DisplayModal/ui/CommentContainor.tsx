import { useEffect, useRef, useState } from "react";


export default function CommentContainer({ comment }: { comment: string }) {
    const commentRef = useRef<HTMLParagraphElement>(null);

    const [isOverflow, setIsOverflow] = useState<boolean>();
    const [folded, setFolded] = useState<boolean>(true);

    const init = () => {
        if (commentRef.current) {
            setIsOverflow(commentRef.current.scrollHeight > commentRef.current.clientHeight)

        } else {
        }
    }

    useEffect(() => {
        init();
    }, [])

    return (
        <>
            <p ref={commentRef} className={`${isOverflow && folded ? 'line-clamp-3' : null }`} onClick={() => {
                if (commentRef.current == undefined) return;
                console.log(commentRef.current.scrollHeight > commentRef.current.clientHeight)
            }}>{comment}
            </p>
            {isOverflow ? <button className={`${folded ? 'text-blue' : 'text-red'}`} onClick={()=> setFolded(!folded)}>{folded ? 'Show more' : 'Show less'}</button> : null}
        </>
    )
}