"use client";
import Image from "next/image";
import TimeAgo from "./TimeAgo";
import { GeocodeResponse } from "@/types/Geocode";
import LocationInfo from "./LocationInfo";
export default function PostHero({
  image,
  address,
  createdAt,
}: {
  image: string;
  address: GeocodeResponse;
  createdAt: number;
}) {
  return (
    <>
      <div className="w-full h-12 flex justify-end items-center">
        
      </div>
      <figure className="relative w-full max-w-[1024px] aspect-[16/9]">
        <Image
          src={image}
          className="object-cover"
          fill
          alt="Post"
          sizes="(max-width: 768px) 100vw, 70vw"
          priority
        />
      </figure>
      <div className="w-full h-12 flex justify-between items-center">
        <LocationInfo address={address.formatted_address} />
        <TimeAgo createdAt={createdAt} />
      </div>
    </>
  );
}
