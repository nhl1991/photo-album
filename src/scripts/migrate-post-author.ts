import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function migrate() {
  const snap = await adminDb.collection("posts").get();

  const batch = adminDb.batch();
  let count = 0;

  snap.docs.forEach(async (doc) => {
    const data = doc.data();
    console.log(data);
    if(data.userId)
      batch.update(doc.ref, {
        userId: FieldValue.delete()
        })
    if(data.image)
      batch.update(doc.ref, {
        imageUrl: data.image,
        image: FieldValue.delete()
      })

    if (!data.username || !data.avartar) return;
    batch.update(doc.ref, {
      author: {
        displayName: data.username,
        photoURL: data.avartar,
        uid: data.userId
      }
    })
    batch.update(doc.ref, {
      username: FieldValue.delete(),
      avartar: FieldValue.delete(),
    });
  });


  await batch.commit();


  console.log(`Updated ${count} fields`);
  return `Updated ${count} fields`;
}
