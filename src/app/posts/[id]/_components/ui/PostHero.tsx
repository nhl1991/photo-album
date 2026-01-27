"use client";
import LocationInfo from "@/components/DisplayModal/ui/LocationInfo";
import Image from "next/image";
import TimeAgo from "./TimeAgo";
export default function PostHero({image, address, createdAt}: {
    image: string,
    address: string,
    createdAt: number
}) {
  return (
    <>
      <figure className="relative w-full max-w-[1024px] aspect-[16/9]">
        <Image
          src={image}
          className="object-cover"
          fill
          alt=""
          sizes="(max-width: 768px) 100vw, 70vw"
          priority
        />
      </figure>
      <div className="w-full flex justify-between items-center">
        <LocationInfo address={address} />
        <TimeAgo createdAt={createdAt} />
      </div>
    </>
  );
}
