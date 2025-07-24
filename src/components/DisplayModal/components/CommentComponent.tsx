import { auth } from "@/app/firebase"
import { Comment } from "@/utils/interface";
import CommentInput from "./CommentInput";
import CommentsList from "../ui/CommentsList";
import CommentCount from "../ui/CommentCount";

export default function CommentComponent({ id, comments }: {
    id: string // doc.id;
    comments: Comment[] | null
}) {

    const user = auth.currentUser;
    
    if (!user) return;
    const { uid, displayName } = user; 

    return (
        <div className="w-full h-full grid grid-rows-12 grid-cols-1">
            <div className="w-full h-full row-span-1">
                <CommentCount length={comments ? comments.length : 0} />
            </div>
            <div className="w-full h-full py-2 px-4  row-span-9 overflow-scroll">
                <CommentsList id={id} uid={uid} comments={comments} />
            </div>
            <div className="w-full h-full flex items-center justify-center py-2 px-4 row-span-2">
                <CommentInput uid={uid} displayName={displayName} id={id} />
            </div>
        </div>
    )
}