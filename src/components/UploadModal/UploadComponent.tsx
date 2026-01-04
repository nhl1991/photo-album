"use client";

import Image from "next/image";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Address from "./components/AddressInput";
import { auth, db, storage } from "@/lib/firebase";
import UploadIcon from "../icons/UploadIcon";
import DeleteIcon from "../icons/DeleteIcon";
import CloseIcon from "../icons/CloseIcon";
import { getAddressByGps } from "@/utils/google-geocode";
import { useRouter } from "next/navigation";


export default function Upload({
  setter,

}: {
  setter: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fname, setFname] = useState("사진 없음");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string>("");

  const WrapperRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const onUploadFile = async () => {
    if (!fileRef || !fileRef.current) return;
    const { files } = fileRef.current;
    if (files && files[0].size > 1024 * 1024 * 10) {
      alert("You can upload less than 10MB.");
      return;
    }

    if (files && files.length === 1) {
      try {
        setIsLoading(true);
        const selectedFile = files[0];
        setFile(selectedFile);
        setFname(selectedFile.name);
        const address = await getAddressByGps(selectedFile);
        setAddress(address);
      } catch (err) {
        if (err instanceof FirebaseError) console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onCloseBtn = () => {
    if (!WrapperRef.current || isLoading) return;
    const el = WrapperRef.current;

    setIsLoading(true);
    el.classList.add("animate-fade-Out");

    const handleEnd = () => {
      el.removeEventListener("animationend", handleEnd);
      setIsLoading(false);

      setter(false);
    };

    el.addEventListener("animationend", handleEnd, { once: true });
    setIsLoading(false);
  };

  const deleteOnUploadFile = () => {
    if (!fileRef || !fileRef.current) return;
    fileRef.current.files = null;
    setFile(null);
    setAddress("");
    setFname("");
  };

  const onChangeTitle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (
      e.currentTarget instanceof HTMLInputElement &&
      e.currentTarget.name === "title"
    )
      setTitle(e.currentTarget.value);
  };

  const onChangeDescription = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (
      e.currentTarget instanceof HTMLTextAreaElement &&
      e.currentTarget.name === "description"
    )
      setDescription(e.currentTarget.value);
  };
  const isSubmitReady = () => {
    const user = auth.currentUser;
    if (
      !user ||
      !file ||
      isLoading ||
      title === "" ||
      title.length > 20 ||
      description === ""
    )
      return false;
    else return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !file || isLoading || title === "" || description === "") {
      alert("제목과 내용을 입력해주세요.");
      return;
    } else if (title.length > 20) {
      alert("제목은 최대 20자까지 가능합니다.");
      return;
    } else
      try {
        setIsLoading(true);
        const post = {
          
          title,
          description,
          createdAt: Date.now(),
          avartar: user.photoURL,
          username: user.displayName || "Anonymous",
          userId: user.uid,
          comments: null,
          address,
          like: null,
          likes: 0,
          view: 0,
        }
        const doc = await addDoc(collection(db, "posts"), post);


        const locationRef = ref(storage, `posts/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          image: url,
        });
        

        setter(false);
      } catch (e) {
        if (e instanceof FirebaseError) console.log(e);
      } finally {
        setTitle("");
        setFile(null);
        setIsLoading(false);
        router.refresh();
      }

    // console.log(e);
  };

  useEffect(() => {
    return () => {
      setFile(null);
      setFname("사진 없음");

      
    };
  }, []);

  return (
    <div
      id="modal"
      ref={WrapperRef}
      className="w-screen h-screen flex items-center justify-center bg-white/80 p-8 md:p-4 fixed top-0 left-0 z-50 animate-fade-In"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full md:max-w-xl relative grid grid-rows-12 grid-cols-1 text-white rounded-2xl bg-gray-500">
        <header className="w-full h-full flex items-center justify-center row-start-1 px-2 md:text-2xl">
          <div className="w-full h-full  border-b-2 border-b-gray-400 relative flex items-end justify-center">
            <input
              name="title"
              type="text"
              className={`w-full ${
                title.length <= 20
                  ? `focus:border-b-sky-400`
                  : `focus:border-b-red-400`
              } px-2 outline-0 text-center`}
              onChange={onChangeTitle}
            />
            <p className="w-[5%] text-[12px] md:text-base">{title.length}/20</p>
          </div>
          <div className="w-max h-full">
            <button
              className="justify-items-end  p-1 hover:opacity-50 cursor-pointer"
              value={fname}
              onClick={onCloseBtn}
            >
              <CloseIcon className="w-6 md:w-8" />
            </button>
          </div>
        </header>
        <section ref={sectionRef} className="h-full row-[2/8]">
          <main className="h-full relative md:p-6 col-span-5 row-span-full">
            {file ? (
              <div className="h-full relative p-6 col-span-5 row-span-full">
                <div className="absolute w-max h-max top-0 right-0 z-50">
                  <button
                    className="p-2 cursor-pointer"
                    onClick={deleteOnUploadFile}
                  >
                    <DeleteIcon className="w-8" />
                  </button>
                </div>
                <Image
                  className="w-full h-full p-2 relative rounded-2xl object-contain"
                  src={URL.createObjectURL(file)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt="uploaded file"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full p-4 flex items-center justify-center">
                <label htmlFor="file">
                  <svg
                    className="w-48 hover:stroke-gray-400 cursor-pointer"
                    data-slot="icon"
                    fill="none"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </label>
              </div>
            )}
          </main>
        </section>
        <footer className="row-[8/-1] w-full h-full">
          <div className="w-full h-full p-1 col-span-3 row-span-full ">
            <form
              className="w-full h-full grid grid-cols-1 grid-rows-8 gap-1 md:gap-2 rounded-2xl items-center justify-center"
              onSubmit={onSubmit}
            >
              <div className="w-full h-full row-[1/3] flex flex-col p-1">
                <Address defaultValue={address} setAddress={setAddress} />
              </div>
              <div className="w-full h-full row-[3/7] flex flex-col p-1">
                <div className="w-full h-full flex flex-col">
                  <label
                    className="p-1 font-semibold self-start"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="h-full border-2 rounded-2xl w-full p-2 border-gray-400 focus:border-sky-400 outline-0"
                    onChange={onChangeDescription}
                  />
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-center row-[7/-1]">
                <div className="w-full h-full p-2">
                  {isSubmitReady() ? (
                    <div className="w-full h-full flex items-center-safe justify-center  bg-sky-600 rounded-2xl hover:opacity-80">
                      <label
                        htmlFor="upload"
                        className="px-2 font-bold flex items-center justify-center cursor-pointer"
                      >
                        UPLOAD
                        <UploadIcon className="w-8" />
                      </label>
                      <input
                        id="upload"
                        className={`hidden`}
                        type="submit"
                        name="submit"
                        value="upload"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center-safe justify-center cursor-pointer bg-gray-600 rounded-2xl">
                      <p className="px-2 font-bold">{isLoading ? 'Uploading...' :'UPLOAD'}</p>
                      <UploadIcon className="w-8" />
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    className={`hidden`}
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    onChange={onUploadFile}
                  />
                </div>
              </div>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
}

{
  /* <input id="address" type="text" className="w-full text-center p-2" value={address} onChange={onChangeAddress} /> */
}
