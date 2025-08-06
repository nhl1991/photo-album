'use client'

import Image from "next/image";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getGPS } from "../../utils/exif-utils";
import Address from "./components/AddressInput";
import { auth, db, storage } from "@/app/firebase";
import UploadIcon from "../icons/UploadIcon";
import DeleteIcon from "../icons/DeleteIcon";
import CloseIcon from "../icons/CloseIcon";

export default function Upload({ setter }: {
    setter: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const [file, setFile] = useState<File | null>(null);
    const [fname, setFname] = useState("사진 없음");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState<string>("")
    const fileRef = useRef<HTMLInputElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const onUploadFile = () => {
        if (!fileRef || !fileRef.current) return;
        const { files } = fileRef.current;
        if (files && files[0].size > 1024 * 1024 * 10) {
            alert("You can upload less than 10MB.")
            return;
        }

        if (files && files.length === 1) {
            const selectedFile = files[0];
            setFile(selectedFile);
            setFname(selectedFile.name);
            processExifData(selectedFile);

        }
    }

    const deleteOnUploadFile = () => {
        if (!fileRef || !fileRef.current) return;
        fileRef.current.files = null;
        setFile(null);
        setFname("")
    }

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e.target instanceof HTMLTextAreaElement);
        if (e.currentTarget instanceof HTMLInputElement && e.currentTarget.name === 'title')
            setTitle(e.currentTarget.value);

    }

    const onChangeDescription = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.currentTarget instanceof HTMLTextAreaElement && e.currentTarget.name === 'description')
            setDescription(e.currentTarget.value);
    }
    const isSubmitReady = () => {
        const user = auth.currentUser;
        if (!user || !file || isLoading || title === "" || description === "")
            return false;
        else return true;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || !file || isLoading || title === "" || description === "") {
            alert('제목과 내용을 입력해주세요.')
            return;
        }
        else if (title.length > 20) {
            alert('제목은 최대 20자까지 가능합니다.');
            return;
        } else
            try {
                setIsLoading(true);

                const doc = await addDoc(collection(db, "posts"), {
                    title,
                    description,
                    createdAt: Date.now(),
                    avartar: user.photoURL,
                    username: user.displayName || "Anonymous",
                    userId: user.uid,
                    address,
                    like: null,
                    likes: 0,
                    view: 0,


                })
                const locationRef = ref(
                    storage,
                    `posts/${user.uid}/${doc.id}`
                );
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    image: url,
                });
                setter(false);
            } catch (e) {
                if (e instanceof FirebaseError)
                    console.log(e);
            } finally {
                setTitle("");
                setFile(null)
                setIsLoading(false);
            }

        console.log(e);
    }

    useEffect(() => {


        return () => {
            setFile(null);
            setFname("사진 없음");
        }
    }, [])


    const processExifData = async (file: File) => {
        try {

            const gps = await getGPS(file);
            if (gps) {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${gps.Latitude},${gps.Longitude}&result_type=political&key=AIzaSyDFZ_1A_G4R6IjolqGwB39R2ub-7Q9sFU0`,
                )
                const { results } = await response.json();

                if (results && results.length > 0) {
                    setAddress(results[0].formatted_address);
                } else {
                    setAddress("주소를 찾을 수 없습니다.");
                }
            } else {
                setAddress("GPS 데이터를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("EXIF 처리 중 오류:", error);
            setAddress("EXIF 데이터를 처리하는 중 오류가 발생했습니다.");
        }
    };

    return (
        <div id="modal" className="w-[100vw] h-[100vh] flex items-center justify-center bg-black/20 md:p-0 p-4 fixed top-0 left-0 z-50" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="w-full h-full md:w-1/3 md:min-w-[50rem] md:h-3/4 relative bg-gray-900  grid grid-rows-12 grid-cols-1 text-white rounded-2xl ">

                <header className="w-full h-max px-4 py-2 flex row-start-1">
                    <div className="w-full px-2">
                        <input name="title" type="text" className={`w-full h-12 border-b-2 border-b-gray-400 ${title.length <= 20 ? `focus:border-b-sky-400` : `focus:border-b-red-400`} px-2 outline-0 text-center`} onChange={onChangeTitle} />
                        <p className="w-[5%] text-[12px] ">{title.length}/20</p>
                    </div>
                    <div className="w-max h-max">
                        <button className="justify-items-end  p-1 hover:opacity-50 cursor-pointer" value={fname} onClick={() => setter(false)}>
                            <CloseIcon className="w-8" />
                        </button>
                    </div>
                </header>
                <section ref={wrapperRef} className="h-full row-[2/8] ">

                    <div className="h-full relative p-6 col-span-5 row-span-full">

                        {
                            file ?
                                <div className="h-full relative p-6 col-span-5 row-span-full">
                                    <div className="absolute w-max h-max top-0 right-0 z-50">
                                        <button className="p-2 cursor-pointer" onClick={deleteOnUploadFile}>
                                            <DeleteIcon className="w-8" />
                                        </button>
                                    </div>
                                    <Image className="w-full h-full p-2 relative rounded-2xl" src={URL.createObjectURL(file)} objectFit="contain" fill alt="uploaded file" />

                                </div>
                                : <div className="w-full h-full p-4 flex items-center justify-center">
                                    <label htmlFor="file">
                                        <svg className="w-48 hover:stroke-gray-400 cursor-pointer" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </label>
                                </div>
                        }
                    </div>



                </section>
                <footer className="row-[8/-1] w-full h-full">
                    <div className="p-2 col-span-3 row-span-full">
                        <div>
                            <p></p>
                        </div>
                        <form className="w-full h-full flex flex-col rounded-2xl p-4 items-center justify-center" onSubmit={onSubmit}>
                            <label className="font-semibold self-start" htmlFor="address">Location</label>

                            <Address defaultValue={address} setAddress={setAddress} />
                            <label className="font-semibold self-start" htmlFor="description">Description</label>
                            <textarea id="description" name="description" className="my-2 border-2 rounded-2xl w-full h-54 p-2 border-gray-400 focus:border-sky-400 outline-0" onChange={onChangeDescription}>

                            </textarea>
                            <div className="w-full flex p-2 items-center justify-center">
                                <input ref={fileRef} className={`hidden`} type="file" id="file" name="file" accept="image/*" onChange={onUploadFile} />
                                {isSubmitReady() ? <div className="w-full flex items-center-safe justify-center px-4 py-1 cursor-pointer bg-sky-600 rounded-2xl hover:opacity-80" >
                                    <p className="px-2 font-bold">UPLOAD</p>
                                    <label htmlFor="upload">
                                        <UploadIcon className="w-8" />
                                    </label>
                                    </div> : null}
                                <input id="upload" className={`hidden`} type="submit" name="submit" value={isLoading ? `완료` : '올리기'} />
                            </div>
                        </form>

                    </div>
                </footer>

            </div>
        </div>
    )
}



{/* <input id="address" type="text" className="w-full text-center p-2" value={address} onChange={onChangeAddress} /> */ }