

import { db } from "@/app/firebase";
import { deleteComment } from "@/utils/firebase-utils";
import { Comment } from "@/utils/interface";
import { TimeConverter } from "@/utils/time-conversion";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import CommentContainer from "./CommentContainor";
export default function CommentsList({ id, uid, comments }: { id: string, uid: string, comments: Comment[] | null }) {


    const onDelete = async (index: number) => {
        const reference = doc(db, `/posts/${id}`);
        if (comments)
            deleteComment(reference, comments, index);
        else return;
    }

    useEffect(()=>{
    },[])

    return (
        <>
            {
                comments ? comments.map((comment: Comment, index) => {
                    return <div className="w-full  flex flex-col text-sm my-1 p-1 gap-1 bg-gray-800 rounded-2xl" key={index}>
                        <header className="w-full p-1">
                            <p className="w-max px-1 font-bold ">{comment.displayName}</p>
                        </header>
                        <section  className="w-full h-max px-4  " >
                            <CommentContainer comment={comment.comment} />
                            
                        </section>
                        <footer className="w-full flex justify-end p-1">

                            {comment.uid === uid ? <div className="flex px-2 py-1 font-bold gap-2 text-gray-400">
                                <button className="cursor-pointer hover:opacity-80">
                                    UPDATE
                                </button>
                                <button className="cursor-pointer hover:opacity-80" onClick={() => onDelete(index)}>
                                    DELETE
                                </button>
                            </div>
                                : null}
                            <div className="px-2 py-1">
                                <p className=" text-white">{TimeConverter(comment.createdAt)}</p>
                            </div>
                        </footer>



                    </div>
                }) : null
            }

        </>
    )
}