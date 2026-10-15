import { storage } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { AuthUser } from "@/types/Auth";

export default function Avartar({ user }: { user: AuthUser }) {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleOnProfileImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user.uid}`);
      try {
        const result = await uploadBytes(locationRef, file);
        const photoURL = await getDownloadURL(result.ref);

        setAvatar(photoURL);
        await updateProfile(user, {
          photoURL: photoURL,
        });
      } catch (e) {
        setAvatar(user.photoURL)
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (user) setAvatar(user.photoURL);
  }, [user]);

  return (
    <div>
      <label htmlFor="avartar" className="group block rounded-full hover:cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
        <span className="sr-only">Change profile photo</span>
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-line text-muted ring-1 ring-line transition-opacity duration-300 group-hover:opacity-85">
          {user && avatar ? (
            <Image
              src={avatar}
              className="object-cover"
              fill
              alt="image"
              sizes="(max-width: 768px) 80vw, 20vw"
              priority
            />
          ) : (
            <svg
              className="w-full"
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
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </div>
        <input
          id="avartar"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleOnProfileImage}
        />
      </label>
    </div>
  );
}
