import { storage } from "@/app/firebase";
import { User, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useState } from "react";
import Image from "next/image";


export default function Avartar({user}: {user: User|null}) {

    const [, setAvartar] = useState<string | undefined | null>(user?.photoURL);

    const onAvartarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const { files } = e.target;
        if (files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);

            await updateProfile(user, {
                photoURL: avatarUrl,
            })
            setAvartar(avatarUrl);
        }
    }

    return (
        <div>
            <label htmlFor="avartar" className="hover:cursor-pointer">
                <div className="w-36 h-36 bg-gray-500 relative rounded-full overflow-hidden">
                    {user && user.photoURL ? <Image src={user.photoURL} fill objectFit="cover" alt="image" sizes="(max-width: 128px)" /> : <svg className="w-full" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>}
                </div>
                <input id="avartar" type="file" className="hidden" onChange={onAvartarChange} />
            </label>
        </div>
    )
}