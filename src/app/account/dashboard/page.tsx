'use client'
import { auth, db } from "@/app/firebase"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { iPost } from "@/types/interface";
import TimelineWrapper from "@/components/TimelineWrapper";
import Timeline from "@/components/Post";
import { UnsubRefContext } from "@/components/contexts/unsubscribeContext";
import { FirebaseError } from "firebase/app";

export default function Page() {
    const [posts, setPosts] = useState<iPost[]>([])
    const [loading, setLoading] = useState(true);
    const unsubRef = useContext(UnsubRefContext);
    useEffect(() => {
        // let unsubscribe: Unsubscribe | null = null;

        const fetchPosts = async () => {

            if (!unsubRef) return;
            const user = auth.currentUser;

            if (!user) return;
            setLoading(true);

            const postQuery = query(
                collection(db, "posts"),
                where("userId", "==", user.uid),
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
            setLoading(false);

        }

        return onAuthStateChanged(auth, (user: User | null) => {
            console.log(user === null);
            if (user) fetchPosts();
            else if (unsubRef) unsubRef.current?.();
        })
    }, [loading, unsubRef])
    return (
        <div className="w-[100vw] min-h-[100vh] flex items-center justify-center">
            <TimelineWrapper>
                <Timeline posts={posts} />
            </TimelineWrapper>
        </div>
    )
}