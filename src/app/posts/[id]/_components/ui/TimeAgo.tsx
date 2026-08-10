"use client";

import { getTimeAgo } from "@/utils/getTimeAgo";

export default function TimeAgo({ createdAt }: { createdAt: number }) {
   const timeAgo = getTimeAgo(createdAt);
  return <p className="w-max text-studio-dim font-mono-ui px-8">{timeAgo}</p>;
}
