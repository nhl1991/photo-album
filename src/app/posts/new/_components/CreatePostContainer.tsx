"use client";
import { GeocodeResponse, GeocodeResults } from "@/types/Geocode";
import { useEffect, useState } from "react";
import ImagePreview from "./Image/ImagePreview";
import ImageUploader from "./Image/ImageUploader";
import AddressContainer from "./Address/AddressContainer";
import CloseIcon from "@/components/icons/CloseIcon";
import SelectedPlaceResult from "./Address/SelectedPlaceResult";
import PlaceIcon from "@/components/icons/PlaceIcon";
import CreatePostForm from "./CreatePostForm";
import { FormState } from "@/types/Form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { collection, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BlocksShuffle from "@/components/icons/BlocksShuffle";
export default function CreatePostContainer() {
  // Image Uploader start
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResults>();
  const [file, setFile] = useState<File | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ title: "", content: "" });
  const [modal, setModal] = useState<boolean>(false);
  const [address, setAddress] = useState<GeocodeResponse | null>(null);
  const [onLoadComplete, setOnLoadComplete] = useState<boolean>(false); // Image load status
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();
  const handleSelectPlaceId = (place_id: string): void => {
    setPlaceId(place_id);
    setModal(false);
  };

  const handleOnSubmit = async () => {
    if (!file) {
      alert("Please upload an image.");
      return;
    }
    if (form.title.trim().length === 0) {
      alert("Please enter a title.");
      return;
    }
    if (form.content.trim().length === 0) {
      alert("Please enter some content.");
      return;
    }
    if (!user) {
      alert("Auth failed.");
      return;
    }
    if (!address) {
      alert("Address is not available");
      return;
    }
    setIsUploading(true);
    const postId = doc(collection(db, "posts")).id; // ✅ 미리 ID 생성

    const imagePath = `posts/${user.uid}/${postId}`;
    const locationRef = ref(storage, imagePath);
    const result = await uploadBytes(locationRef, file);
    const url = await getDownloadURL(result.ref);
    const { displayName, photoURL } = user;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("address", JSON.stringify(address));
    formData.append("displayName", displayName ?? "Anonymous");
    formData.append("photoURL", photoURL ?? "");
    formData.append("imageUrl", url);
    formData.append("imagePath", imagePath);
    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setIsUploading(false);
      router.push("/");
    }
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  // Image Uploader end

  return (
    <>
      {isUploading ? (
        <>
          <BlocksShuffle className="w-48 h-48" />
          <p>Uploading</p>
        </>
      ) : (
        <article className="w-full flex flex-col gap-y-4 lg:max-w-5xl min-h-screen">
          <header className="flex items-center justify-center rounded-xl shadow-xl p-2 relative w-full max-w-[1024px] aspect-[16/9] overflow-hidden">
            {file ? (
              <ImagePreview
                file={file}
                setFile={setFile}
                setOnLoadComplete={setOnLoadComplete}
              />
            ) : (
              <ImageUploader
                setFile={setFile}
                setGeocodeResults={setGeocodeResults}
                setOnLoadComplete={setOnLoadComplete}
              />
            )}
          </header>
          <section className="p-2 min-h-60">
            {file && onLoadComplete && modal ? (
              <div className="w-screen h-screen bg-black/30 flex flex-col items-center justify-center gap-y-2 rounded-xl shadow-xl py-2 fixed top-0 left-0 z-50">
                <div className="max-w-[768px] w-full h-[384px] bg-white dark:bg-slate-900 rounded-xl relative overflow-scroll">
                  <div className="flex justify-end items-center p-2">
                    <div className="w-full flex items-center justify-center">
                      <PlaceIcon className="w-6" />
                      <h1 className="text-center font-bold">PLACES</h1>
                    </div>
                    <button onClick={() => setModal(false)}>
                      <CloseIcon className="w-8" />
                    </button>
                  </div>
                  <AddressContainer
                    file={file}
                    handleSelectPlaceId={handleSelectPlaceId}
                  />
                </div>
              </div>
            ) : null}
            <div className="p-8 rounded-xl shadow-xl flex flex-col gap-y-4">
              <div className="w-max flex gap-x-4 ">
                <h2 className="flex text-white items-center px-3 py-1 bg-lime-500 rounded-xl ">
                  <PlaceIcon className="w-4" />
                  PLACE
                </h2>

                <button
                  className="btn-wrap btn-hover"
                  onClick={() => {
                    if (!file && !onLoadComplete)
                      alert("Upload the photo first.");
                    else setModal(true);
                  }}
                >
                  SEARCH
                </button>
              </div>
              <SelectedPlaceResult place_id={placeId} setAddress={setAddress} />
            </div>

            <div className="flex justify-between items-center p-8  rounded-xl shadow-xl">
              {/* <Author
                avartar={post.avartar}
                username={post.username}
                className="w-10 h-10"
              /> */}
              <CreatePostForm setForm={setForm} />
            </div>
          </section>

          <footer>
            <div className="flex items-center justify-center py-4">
              <button className="btn-wrap btn-hover" onClick={handleOnSubmit}>COMPLETE</button>
            </div>
          </footer>
        </article>
      )}
    </>
  );
}

// 사진 업로드
//  └─ EXIF에 GPS 있음?
//      ├─ YES → 위치 후보 표시
//      │        ├─ 유저 선택
//      │        └─ (마음에 안 들면) 수동 검색
//      └─ NO  → 수동 검색
