import { auth, db } from "@/app/firebase";
import { updateLike } from "@/app/utils/firebase-utils";
import { doc, getDoc } from "firebase/firestore";

import { useEffect, useState } from "react";

export default function LikeButton({ id, like, length }: {
    id: string,
    like: Array<string>,
    length: number
}) {
    const user = auth.currentUser;

    const [userlist, setUserlist] = useState<Array<string> | null>(null);
    const [userLike, setUserLike] = useState<boolean>(false)



    const onClick = async () => {
        // e.preventDefault();
        const likeRef = doc(db, `/posts/${id}`);
        const likeSnap = await getDoc(likeRef);
        if (!likeSnap.exists() || !user) return;

        if (userlist && userlist.includes(user.uid)) {
            if (userlist.length === 1) {
                await updateLike(likeRef, null);
                setUserlist(null);
            }else {
                const removedUser = userlist.filter((uid) => uid != user.uid);
                await updateLike(likeRef, removedUser);
                setUserlist(removedUser)
            }

        }else if(userlist){
            const addedUser = userlist.concat(user.uid);
            await updateLike(likeRef, addedUser);
            setUserlist(addedUser);

        }else {
            await updateLike(likeRef, [user.uid]);
            setUserlist([user.uid]);

        }
    }



    useEffect(() => {
        
        setUserlist(like);

        if(user && like && like.includes(user.uid)){

            setUserLike(true);
        }
        else{

            setUserLike(false);
        }

    }, [user, like])

    return (
        <div className="flex items-center justify-center ">
            <button onClick={onClick} className="cursor-pointer">
                <svg className="w-4" data-slot="icon" fill={userLike ? "red" : "none"} strokeWidth={1.5} stroke={userLike ? "red" : "white"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </button>
            <p className="px-2">{length}</p>
        </div>
    )
}