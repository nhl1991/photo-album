"use client";
import CollapseIcon from "@/components/icons/CollapseIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import ExpandIcon from "@/components/icons/ExpandIcon";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
export default function ImagePreview({
  file,
  setFile,
  setOnLoadComplete,
}: {
  file: File;
  setFile: Dispatch<SetStateAction<File | null>>;
  setOnLoadComplete: Dispatch<SetStateAction<boolean>>;
}) {
  const [preview, setPreview] = useState<string>("");
  const [objectFit, setObjectFit] = useState<"object-cover" | "object-contain">("object-cover")
  useEffect(() => {
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  }, [file]);
  if (preview)
    return (
      <div className="h-full w-full">
        <figure className="relative h-full w-full">
          <Image
            src={preview}
            className={objectFit}
            fill
            alt=""
            sizes="(max-width: 768px) 100vw, 70vw"
            priority
            onLoad={() => setOnLoadComplete(true)}
          />
        </figure>
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/45 p-1 text-white backdrop-blur">
          <button className="icon-btn h-9 w-9 text-white hover:bg-white/15 hover:text-white" aria-label={objectFit === "object-cover" ? "Show whole image" : "Fill frame"} onClick={()=> setObjectFit((prev) => prev === 'object-contain' ? 'object-cover' : 'object-contain')}>{objectFit === "object-cover" ? <CollapseIcon className="w-5" /> : <ExpandIcon className="w-5" />}</button>
          <button className="icon-btn h-9 w-9 text-white hover:bg-white/15 hover:text-white" aria-label="Remove photo" onClick={() => setFile(null)}><DeleteIcon className="w-5" /></button>
        </div>
      </div>
    );
}
