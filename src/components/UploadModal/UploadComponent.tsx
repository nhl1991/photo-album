'use client'

import Image from "next/image";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getGPS } from "../../utils/exif-utils";
import Address from "./components/AddressInput";
import { auth, db, storage } from "@/app/firebase";

export default function Upload({ setter }: {
    setter: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const [file, setFile] = useState<File | null>(null);
    const [fname, setFname] = useState("사진 없음");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState<string>("")
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const onUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
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
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e.target instanceof HTMLTextAreaElement);
        if (e.currentTarget instanceof HTMLInputElement && e.currentTarget.name === 'title')
            setTitle(e.currentTarget.value);

    }

    const onChangeDescription = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.currentTarget instanceof HTMLTextAreaElement && e.currentTarget.name === 'description')
            setDescription(e.currentTarget.value);
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || !file || isLoading || title === "" || description === "" || title.length > 20) {
            alert('제목과 내용을 입력해주세요.')
            return;
        }

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
        <div className="w-[100vw] h-[100vh] bg-black/20 grid grid-cols-12 grid-rows-12 gap-2 absolute top-0 z-50" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="w-[90%] h-full bg-gray-900 grid grid-cols-4 grid-rows-4 col-[2/12] row-[2/12]  text-white rounded-2xl ">

                <header className="w-[100%] h-max grid grid-cols-12 py-2 px-4 col-span-full row-end-1  ">
                    <div className="col-[1/12] flex justify-center items-center">
                        <input name="title" type="text" className={`w-[95%] h-12 border-b-2 border-b-gray-400 ${title.length <= 20 ? `focus:border-b-sky-400` : `focus:border-b-red-400`} px-2 outline-0 text-center`} onChange={onChangeTitle} />
                        <p className="w-[5%] text-[12px] ">{title.length}/20</p>
                    </div>
                    <button className="justify-items-end p-1 hover:opacity-50 cursor-pointer" value={fname} onClick={() => setter(false)}>
                        <svg className="w-8 h-8 " data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <section ref={wrapperRef} className="grid grid-cols-8 grid-rows-8 col-span-4 row-span-4">

                    <div className=" relative m-1 p-6 col-span-5 row-span-full ">
                        {file ?
                            <>
                                <Image className="w-full p-1 relative rounded-2xl" src={URL.createObjectURL(file)} objectFit="contain" fill alt="uploaded file" />

                            </>
                            : null}
                    </div>
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
                            <label className={`w-full max-h-10 border-2 rounded-2xl px-4 py-1 text-base m-1 text-center cursor-pointer overflow-x-scroll ${file ? 'border-sky-400' : 'border-red-500'}`} htmlFor="file">{file ? fname : "파일 없음"}</label>
                            <input className={`hidden`} type="file" id="file" name="file" accept="image/*" onChange={onUploadFile} />
                            <input className={`w-full border-2 rounded-2xl place-items-end px-4 py-1 text-base m-1 cursor-pointer ${file ? 'border-sky-400' : 'border-red-500'}`} type="submit" name="submit" value={isLoading ? `완료` : '올리기'} />
                        </form>

                    </div>


                </section>
                {/* <section className="w-full p-2">
                    <div ref={wrapperRef} className="w-full h-full flex p-2 ">
                        <div className="w-2/3 h-full relative m-1 p-6 ">
                            {file ?
                                <><Image className="w-full p-12 relative  border-2 border-gray-400 rounded-2xl" src={URL.createObjectURL(file)} objectFit="contain" fill alt="uploaded file" />

                                </>
                                : null}
                        </div>
                        <div className="w-1/3 h-full m-1 p-2">
                            <div>
                                <p></p>
                            </div>
                            <form className="w-full h-full flex flex-col border-2 rounded-2xl border-gray-400 p-4 items-center justify-center" onSubmit={onSubmit}>
                                <label className="font-semibold self-start" htmlFor="address">Location</label>
                                
                                <Address defaultValue={address} setAddress={setAddress}/>
                                <label className="font-semibold self-start" htmlFor="description">Description</label>
                                <textarea id="description" name="description" className="my-2 border-2 rounded-2xl w-full h-54 p-2 border-gray-400 focus:border-sky-400 outline-0" onChange={onChangeDescription}>

                                </textarea>
                                <label className={`w-full max-h-10 border-2 rounded-2xl px-4 py-1 text-base m-1 text-center cursor-pointer overflow-x-scroll ${file ? 'border-sky-400' : 'border-red-500'}`} htmlFor="file">{file ? fname : "파일 없음"}</label>
                                <input className={`hidden`} type="file" id="file" name="file" accept="image/*" onChange={onUploadFile} />
                                <input className={`w-full border-2 rounded-2xl place-items-end px-4 py-1 text-base m-1 cursor-pointer ${file ? 'border-sky-400' : 'border-red-500'}`} type="submit" name="submit" value={`COMPLETE`} />
                            </form>

                        </div>
                    </div>
                </section> */}

            </div>
        </div>
    )
}



{/* <input id="address" type="text" className="w-full text-center p-2" value={address} onChange={onChangeAddress} /> */ }