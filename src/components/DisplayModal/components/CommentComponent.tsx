import { auth, db } from "@/lib/firebase"
import { Comment } from "@/types/interface";
import CommentInput from "./CommentInput";
import CommentsList from "../ui/CommentsList";
import CommentCount from "../ui/CommentCount";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function CommentComponent({ id, comments }: {
    id: string // doc.id;
    comments: Comment[] | null
}) {

    const user = auth.currentUser;
    
    // if (!user) return;
    // const { uid, displayName } = user; 
    useEffect(()=>{
        const init = async () => {

            const reference = doc(db, `/posts/${id}`);
            const data = await getDoc(reference)
            console.log(data);
        }
        init();
    },[])

    return (
        <div className="w-full h-full grid grid-rows-12 grid-cols-1">
            <div className="w-full col-start-1 h-full row-span-1">
                <CommentCount length={comments ? comments.length : 0} />
            </div>
            <div className="w-full col-start-1 h-full py-2 px-4  row-span-9 overflow-scroll text-sm md:text-xl">
                <CommentsList id={id} comments={comments} />
            </div>
            <div className="w-full col-start-1 h-full flex items-center justify-center py-2 px-4 row-span-2">
                {user ? <CommentInput user={user} id={id} /> : null}
            </div>
        </div>
    )
}