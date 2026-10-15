/**
 * Get All posts order by createdAt
 */
import { adminAuth, adminDb, adminStorage } from "@/lib/firebase-admin";
import { verifySessionCookie } from "@/lib/verifySession";
import { getDownloadURL } from "firebase-admin/storage";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const DOCS_SIZE = 8;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // createdAt (string)
  let query = adminDb
    .collection("posts")
    .orderBy("createdAt", "desc")
    .limit(DOCS_SIZE);

  if (cursor !== null && cursor !== undefined) {
    query = query.startAfter(Number(cursor));
  }
  const t0 = Date.now();
  try {
    const snap = await query.get();
    console.log(
      "[posts] firestore ok",
      Date.now() - t0,
      "ms",
      "size",
      snap.size,
    );
    const docs = snap.docs;
    let lastDoc;
    if (docs.length < DOCS_SIZE) lastDoc = null;
    else lastDoc = docs.at(-1);
    const raw = lastDoc?.get("createdAt");

    return Response.json({
      items: docs.map((d) => ({ id: d.id, ...d.data() })),
      nextCursor: lastDoc ? raw.toString() : null,
    });
  } catch (e) {
    console.error("[posts] firestore fail", Date.now() - t0, "ms", e);
    throw e;
  }

  //   const snap = await query.get();
}

const getRequiredString = (fd: FormData, key: string): string => {
  const v = fd.get(key);
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`${key}_required`);
  }
  return v.trim();
};

export async function POST(req: NextRequest) {
  // get session from server
  const session = (await cookies()).get("session");
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // extract token from session
  const tokenId = session.value;

  // decoding token
  const decode = await verifySessionCookie(tokenId);
  if (!decode)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { displayName, photoURL } = await adminAuth.getUser(decode.uid);

  const formData = await req.formData();

  let postId: string;
  let title: string;
  let address: string;
  let content: string;

  try {
    title = getRequiredString(formData, "title");
    address = getRequiredString(formData, "address");
    content = getRequiredString(formData, "content");
    postId = getRequiredString(formData, "postId");
  } catch (err) {
    console.error(err);
    return Response.json({ error: "MISSING_REQUIRED_FIELD" }, { status: 400 });
  }

  if (!/^[A-Za-z0-9]{20}$/.test(postId))
    return NextResponse.json({ error: "INVALID_POST_ID" }, { status: 400 });

  const postRef = adminDb.collection("posts").doc(postId);
  const expectedPath = `posts/${decode.uid}/${postId}`;

  const file = adminStorage.bucket().file(expectedPath);
  const [exists] = await file.exists();
  if (!exists)
    return NextResponse.json({ error: "IMAGE_NOT_FOUND" }, { status: 400 });
  const imageUrl = await getDownloadURL(file);
  await postRef.create({
    title,
    content,
    author: {
      photoURL: photoURL,
      displayName: displayName,
      uid: decode.uid,
    },
    address: JSON.parse(address),
    view: 0,
    likeCount: 0,
    comments: null,
    imageUrl: imageUrl, // 클라에서 쓸 URL
    imagePath: expectedPath,
    createdAt: Date.now(),
  });

  return NextResponse.json({ message: "ok" }, { status: 200 });
}
