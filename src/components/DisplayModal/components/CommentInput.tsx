import { db } from "@/app/firebase"
import { updateComment } from "@/utils/firebase-utils";
import { doc } from "firebase/firestore";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
export default function CommentInput({ uid, displayName, id, }: {
    uid: string,
    displayName: string | null,
    id: string // doc.id;
}) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [draft, setDraft] = useState<string>()
    const debouncedComment = useDebouncedCallback((event) => {
        setDraft(
            event.target.value

        );
    }, 300)
    

    const onClick = async () => {
        if (draft === "" || draft === undefined) return;
        const createdAt = Date.now();
        const postRef = doc(db, `/posts/${id}`);
        await updateComment(postRef, uid, displayName != undefined ? displayName : "Anonymous", draft, createdAt);
        setDraft("");
        if (inputRef && inputRef.current)
            inputRef.current.value = "";
    }

    return (
        <>
            <input ref={inputRef} className="w-full h-6 px-4 py-4 outline-0 bg-white text-black  rounded-xl " name="comment" type="text" onChange={(e) => debouncedComment(e)} placeholder="이 사진 어떤가요..?" />
            <button onClick={onClick}>
                <svg className="w-8 px-2 py-1 mx-1 rounded-full bg-sky-400 hover:opacity-80 hover:cursor-pointer" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
            </button>
        </>
    )
}