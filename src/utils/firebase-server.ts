"use server"

import { adminDb } from "@/lib/firebase-admin"


export async function getAll(){
    const query = (await adminDb.collection("posts").limit(8).orderBy("createdAt", "desc").get()).docs;
    let lastRef = null;
    if(query.length === 8){
        lastRef = query[7]
        // console.log('First ', query[0].data())
        // console.log('First ', query[7].data())
    }
    return {query, lastRef};
}