"use client";
import Image from "next/image";
import TimeAgo from "./TimeAgo";
import { GeocodeResponse } from "@/types/Geocode";
import LocationInfo from "./LocationInfo";
import { useState } from "react";
import CollapseIcon from "@/components/icons/CollapseIcon";
import ExpandIcon from "@/components/icons/ExpandIcon";
export default function PostHero({
  image,
  address,
  createdAt,
}: {
  image: string;
  address: GeocodeResponse;
  createdAt: number;
}) {
  const [objectFit, setObjectFit] = useState<"object-cover" | "object-contain">(
    "object-cover",
  );
  return (
    <>
      <div className="w-full h-12 flex justify-end items-center"></div>
      <figure className="relative w-full max-w-[1024px] aspect-[16/9]">
        <div className="absolute z-50 right-0 ">
          <button
            className="cursor-pointer "
            onClick={() =>
              setObjectFit((prev) =>
                prev === "object-contain" ? "object-cover" : "object-contain",
              )
            }
          >
            {objectFit === "object-cover" ? (
              <CollapseIcon className="w-8 hover:fill-gray-500" />
            ) : (
              <ExpandIcon className="w-8 hover:fill-gray-500" />
            )}
          </button>
        </div>
        <Image
          src={image}
          className={objectFit}
          fill
          alt="Post"
          sizes="(max-width: 768px) 50vw, 35vw"
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
