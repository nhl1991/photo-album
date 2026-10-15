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
      <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface ring-1 ring-line">
        <div className="absolute right-3 top-3 z-10">
          <button
            className="icon-btn bg-canvas/80 text-ink backdrop-blur hover:bg-canvas"
            aria-label={objectFit === "object-cover" ? "이미지 전체 보기" : "프레임 채우기"}
            onClick={() =>
              setObjectFit((prev) =>
                prev === "object-contain" ? "object-cover" : "object-contain",
              )
            }
          >
            {objectFit === "object-cover" ? (
              <CollapseIcon className="w-5" />
            ) : (
              <ExpandIcon className="w-5" />
            )}
          </button>
        </div>
        <Image
          src={image}
          className={objectFit}
          fill
          alt="Post"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </figure>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-3">
        <LocationInfo address={address.formatted_address} />
        <TimeAgo createdAt={createdAt} />
      </div>
    </>
  );
}
