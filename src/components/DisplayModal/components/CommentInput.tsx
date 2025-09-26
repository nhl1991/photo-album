import { db } from "@/lib/firebase"
import CommentUploadIcon from "@/components/icons/CommentUploadIcon";
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
        console.log(id);
        if (draft === "" || draft === undefined) return;
        const createdAt = Date.now();
        const postRef = doc(db, `/posts/${id}`);
        await updateComment(postRef, uid, displayName != undefined ? displayName : "Anonymous", draft, createdAt);
        setDraft("");
        if (inputRef && inputRef.current)
            inputRef.current.value = "";
    }

    return (
        <div className="w-full h-max flex gap-2 items-center justify-center  bg-white rounded-xl p-1">
            <input ref={inputRef} className="w-full h-6 px-4 py-4 outline-0 text-black" name="comment" type="text" onChange={(e) => debouncedComment(e)} />
            <button className=" rounded-full bg-sky-400 hover:opacity-80 hover:cursor-pointer" onClick={onClick}>
                <CommentUploadIcon className="w-10 px-2 py-1" />
            </button>
        </div>
    )
}