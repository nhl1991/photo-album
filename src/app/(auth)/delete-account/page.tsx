"use client";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import Image from "next/image";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function Page() {
  const [deletePosts, setDeletePosts] = useState(false);

  const handleOnClick = () => {
    // deletePosts ? deletePosts : change all posts' userpost.id to anonymous
    if(deletePosts){
        deleteAllPosts();
        deleteUser();
    }else{
        deleteUser();
    }

  };

  const deleteAllPosts = () => {
    const user = auth.currentUser;
    if (!user) return;
    const postQuery = query(
      collection(db, "posts"),
      where("userId", "==", user.uid)
    );
  };

  const deleteUser = () => {

  }

  return (
    <div className="w-screen h-screen bg-sky-200 flex items-center justify-center">
      <div className="w-max flex flex-col gap-2 bg-green-700 p-4">
        <div>
          <div className="w-48 h-48 rounded-full bg-red-600 relative overflow-hidden">
            {auth.currentUser && auth.currentUser.photoURL ? (
              <Image
                className="object-cover"
                src={auth.currentUser.photoURL}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                alt="Avartar"
              />
            ) : null}
          </div>
        </div>
        <div>
          <p>{auth.currentUser?.displayName}</p>
        </div>
        <div className="flex flex-col">
          <input
            type="checkbox"
            id="deletePosts"
            onChange={() => setDeletePosts(!deletePosts)}
          />
          <label htmlFor="deletePosts">Delete all my posts</label>
          <input
            type="submit"
            id="deleteConfirm"
            className="hidden"
            onClick={() => handleOnClick()}
          />
          <label htmlFor="deleteConfirm">Delete</label>
        </div>
      </div>
    </div>
  );
}
