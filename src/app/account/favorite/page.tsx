'use client'
import { auth, db } from "@/app/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import TimelineWrapper from "@/components/TimelineWrapper";

import { iPost } from "@/types/interface";
import { UnsubRefContext } from "@/components/contexts/unsubscribeContext";
import { FirebaseError } from "firebase/app";
import Post from "@/components/Post";


export default function Page() {

    const [posts, setPosts] = useState<iPost[]>([]);
    const unsubRef = useContext(UnsubRefContext);



    useEffect(() => {
        if (!unsubRef) return;
        // let unsubscribe:Unsubscribe|null = null;

        const fetchPosts = async () => {
            const user = auth.currentUser;

            if (!user) return;

            const postQuery = query(
                collection(db, "posts"),
                where("like", "array-contains-any", [user.uid]),
                orderBy("createdAt", "desc"),
            )
            // const snapshot = await getDocs(postQuery);

            unsubRef.current = onSnapshot(postQuery, (snapshot) => {
                const posts = snapshot.docs.map((doc) => {
                    const { like, likes, view, createdAt, description, image, title, userId, username, address, comments, avartar } = doc.data()

                    return {
                        createdAt,
                        comments,
                        description,
                        like,
                        likes,
                        view,
                        image,
                        title,
                        userId,
                        username,
                        address,
                        id: doc.id,
                        avartar
                    }
                })
                setPosts(posts);
            }, (error: FirebaseError) => {
                console.log(error, "=> Permission-denied due to Sign Out.");
                return;
            })
        }
        return onAuthStateChanged(auth, (user: User | null) => {

            if (user) fetchPosts();
            else if (unsubRef) unsubRef.current?.();
        })
    }, [unsubRef])

    return (
        <div className="w-[100vw] h-[100vh] ">
            <TimelineWrapper>
                <Post posts={posts} />
            </TimelineWrapper>
        </div>

    )
}