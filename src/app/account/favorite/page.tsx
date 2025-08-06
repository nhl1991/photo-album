'use client'
import { auth, db } from "@/app/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Unsubscribe, onAuthStateChanged } from "firebase/auth";
import TimelineWrapper from "@/components/TimelineWrapper";
import Timeline from "@/components/Timeline";
import { iPost } from "@/types/interface";


export default function Page() {

    const [posts, setPosts] = useState<iPost[]>([]);

    

    useEffect(() => {
        let unsubscribeFetch:Unsubscribe|null = null;

        const fetchPosts = async () => {
            const user = auth.currentUser;
    
            if (!user) return;
    
            const postQuery = query(
                collection(db, "posts"),
                where("like", "array-contains-any", [user.uid]),
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

        return () =>{ 
            unsubscribeAuthStateChanged?.();
            unsubscribeFetch?.();
        }
    }, [])

    return (
            <div className="w-[100vw] h-[100vh] ">
                <TimelineWrapper>
                    <Timeline posts={posts} />
                </TimelineWrapper>
            </div>

    )
}