import { auth, db } from "@/app/firebase"
import { deleteComment, updateComment } from "@/app/utils/firebase-utils";
import { Comment } from "@/app/utils/interface";
import { TimeConverter } from "@/app/utils/time-conversion";
import { doc } from "firebase/firestore";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function CommentComponent({ id, comments }: {
    id: string // doc.id;
    comments: Comment[] | null
}) {

    const [draft, setDraft] = useState<string>()
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedComment = useDebouncedCallback((event) => {
        setDraft(
            event.target.value

        );
    }, 300)

    const user = auth.currentUser;
    if (!user) return;
    const { uid, displayName } = user;

    const onClick = async () => {
        if (draft === "" || draft === undefined) return;
        const createdAt = Date.now();
        const postRef = doc(db, `/posts/${id}`);
        await updateComment(postRef, uid, displayName != undefined ? displayName : "Anonymous", draft, createdAt);
        setDraft("");
        if (inputRef && inputRef.current)
            inputRef.current.value = "";
    }

    const onDelete = async (index: number) => {

        const reference = doc(db, `/posts/${id}`);
        if (comments)
            deleteComment(reference, comments, index);
        else return;
    }

    return (
        <>
            <p className="px-2 text-xs my-0.5">현재 {comments ? comments.length : 0}개의 코멘트가 있습니다.</p>
            <div className="w-full h-36  my-2 overflow-scroll">
                {
                    comments ? comments.map((comment: Comment, index) => {
                        return <div className="w-full flex flex-col text-sm bg-gray-900 rounded-2xl my-1 p-1 gap-1 " key={index}>
                            <div className="grid grid-cols-[repeat(4, 1fr)] grid-cols-1">
                                <p className="mx-2 font-bold col-end-2 ">{comment.displayName}</p>
                                {comment.uid === uid ? <button className="col-start-3" onClick={() => onDelete(index)}>
                                    <svg className="w-4" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button> : null}</div>
                            <p className="mx-2">{comment.comment}</p>
                            <p className="mx-2 col-[2/3] text-[9px] text-white">{TimeConverter(comment.createdAt)}</p>


                        </div>
                    }) : null
                }
            </div>
            <div className="flex w-full items-center justify-center py-2 px-4 rounded-2xl border-white">

                <input ref={inputRef} className="w-full h-6 px-3 py-2 outline-0 bg-white text-black  rounded-xl " name="comment" type="text" onChange={(e) => debouncedComment(e)} placeholder="이 사진 어떤가요..?" />
                <button onClick={onClick}>
                    <svg className="w-8 px-2 py-1 mx-1 rounded-full bg-sky-400 hover:opacity-80 hover:cursor-pointer" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>
                </button>
            </div>
        </>
    )
}