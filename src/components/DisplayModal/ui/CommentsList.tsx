

import { db } from "@/lib/firebase";
import { deleteComment } from "@/utils/firebase-utils";
import { Comment } from "@/types/interface";
import { TimeConverter } from "@/utils/time-conversion";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import CommentContainer from "./CommentContainor";
export default function CommentsList({ id,  comments }: { id: string, comments: Comment[] | null }) {


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
                    console.log(comment)
                    return <div className="w-full text-sm my-1 p-1 gap-1 bg-gray-800 rounded-2xl" key={index}>
                        <header className="w-full p-1">
                            <p className="px-1 font-bold ">{comment.displayName}</p>
                        </header>
                        <section  className="w-full h-max p-2" >
                            <CommentContainer comment={comment.comment} />
                            
                        </section>
                        <footer className="w-full flex justify-end p-1">

                            {/* {comment.uid === uid ? <div className="flex px-2 py-1 font-bold gap-2 text-gray-400">
                                {/* <button className="cursor-pointer hover:opacity-80">
                                    UPDATE
                                </button> */}
                                {/* <button className="cursor-pointer hover:opacity-80" onClick={() => onDelete(index)}>
                                    DELETE
                                </button> */}
                            {/* </div>
                                : null} */} 
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