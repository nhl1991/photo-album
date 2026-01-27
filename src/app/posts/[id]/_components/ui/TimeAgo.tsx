"use client";

import { getTimeAgo } from "@/utils/time-conversion";

export default function TimeAgo({ createdAt }: { createdAt: number }) {
   const timeAgo = getTimeAgo(createdAt);
  return <p className="w-max text-gray-400 px-8">{timeAgo}</p>;
}
