'use client'
import { auth, db } from "@/app/firebase"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { iPosts } from "@/utils/interface";
import { ModalProvider } from "@/components/DisplayModal/components/ModalContext";
import TimelineWrapper from "@/components/TimelineWrapper";
import Timeline from "@/components/Timeline";

export default function Page() {
    const [posts, setPosts] = useState<iPosts[]>([])
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let unsubscribeFetch:Unsubscribe | null = null;

        const fetchPosts = async () => {

            const user = auth.currentUser;
    
            if (!user) return;
    
            const postQuery = query(
                collection(db, "posts"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"),
            )
    
            // const snapshot = await getDocs(postQuery);
            unsubscribeFetch = onSnapshot(postQuery, (snapshot)=>{
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
            })
            
        }

        const unsubscribeAuthStateChanged = onAuthStateChanged(auth, () => {
            fetchPosts();
        })
        setLoading(false);
        return () => {
            unsubscribeFetch?.();
            unsubscribeAuthStateChanged?.();
        };
    }, [loading])
    return (
        <div className="w-[100vw] h-[100vh]">
            <ModalProvider>
                <TimelineWrapper>
                    <Timeline posts={posts} />
                </TimelineWrapper>
            </ModalProvider>
        </div>
    )
}