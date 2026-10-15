"use client";
import { GeocodeResponse } from "@/types/Geocode";
import { useEffect, useState } from "react";
import ImagePreview from "./Image/ImagePreview";
import ImageUploader from "./Image/ImageUploader";
import AddressContainer from "./Address/AddressContainer";
import CloseIcon from "@/components/icons/CloseIcon";
import SelectedPlaceResult from "./Address/SelectedPlaceResult";
import PlaceIcon from "@/components/icons/PlaceIcon";
import CreatePostForm from "./CreatePostForm";
import { FormState } from "@/types/Form";
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { collection, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BlocksShuffle from "@/components/icons/BlocksShuffle";
import PageHeading from "@/components/common/ui/PageHeading";
export default function CreatePostContainer() {
  // Image Uploader start
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
      alert("이미지를 업로드해주세요.");
      return;
    }
    if (form.title.trim().length === 0) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (form.content.trim().length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!address) {
      alert("장소를 선택해주세요.");
      return;
    }
    setIsUploading(true);
    const postId = doc(collection(db, "posts")).id; // 미리 ID 생성

    const imagePath = `posts/${user.uid}/${postId}`;
    const locationRef = ref(storage, imagePath);
    try {
      await uploadBytes(locationRef, file);
    } catch (err) {
      console.error(err);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("postId", postId);
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("address", JSON.stringify(address));

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`POST_CREATE_FAILED_${response.status}`);

      router.push("/");
    } catch (err) {
      // !ok, fetch 예외 모두 여기로
      console.error(err);
      await deleteObject(locationRef).catch(console.error); // 이미지 정리 (실패해도 계속)
      alert("게시물 생성에 실패했습니다. 다시 시도해주세요.");
      setIsUploading(false);
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
        <div role="status" className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-accent">
          <BlocksShuffle className="w-20 h-20" />
          <p className="eyebrow">업로드 중</p>
        </div>
      ) : (
        <article className="mx-auto flex w-full max-w-5xl flex-col gap-y-6">
          <PageHeading title="새 게시물" />
          <header className={`relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-surface ${file ? "ring-1 ring-line" : "border border-dashed border-line-strong"}`}>
            {file ? (
              <ImagePreview
                file={file}
                setFile={setFile}
                setOnLoadComplete={setOnLoadComplete}
              />
            ) : (
              <ImageUploader setFile={setFile} />
            )}
          </header>
          <section className="flex flex-col gap-y-6">
            {file && onLoadComplete && modal ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="places-title"
                  className="card relative max-h-[80vh] w-full max-w-2xl overflow-y-auto shadow-2xl"
                >
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-5 py-3">
                    <div className="flex items-center gap-2 text-ink">
                      <PlaceIcon className="w-5" />
                      <h2 id="places-title" className="text-sm font-medium uppercase tracking-[0.2em]">장소 검색</h2>
                    </div>
                    <button className="icon-btn" onClick={() => setModal(false)} aria-label="닫기">
                      <CloseIcon className="w-6" />
                    </button>
                  </div>
                  <AddressContainer
                    file={file}
                    handleSelectPlaceId={handleSelectPlaceId}
                  />
                </div>
              </div>
            ) : null}
            <div className="card flex flex-col gap-y-4 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-x-4">
                <h2 className="eyebrow flex items-center gap-1.5 text-ink">
                  <PlaceIcon className="w-4" />
                  장소
                </h2>

                <button
                  className="btn-secondary min-h-9 px-4"
                  onClick={() => {
                    if (!file && !onLoadComplete)
                      alert("먼저 사진을 업로드해주세요.");
                    else setModal(true);
                  }}
                >
                  장소 검색
                </button>
              </div>
              <SelectedPlaceResult place_id={placeId} setAddress={setAddress} />
            </div>

            <div className="card p-6 sm:p-8">
              {/* <Author
                avartar={post.avartar}
                username={post.username}
                className="w-10 h-10"
              /> */}
              <CreatePostForm setForm={setForm} />
            </div>
          </section>

          <footer>
            <div className="flex items-center justify-end py-2">
              <button className="btn-primary min-h-12 w-full px-10 sm:w-auto" onClick={handleOnSubmit}>
                게시하기
              </button>
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
