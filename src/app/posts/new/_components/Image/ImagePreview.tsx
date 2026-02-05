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
  }, []);
  if (preview)
    return (
      <div className="w-full max-w-[1024px] ">
        <figure className="relative w-full aspect-[16/9]  overflow-scroll">
          <Image
            src={preview}
            className={`${objectFit} rounded-xl`}
            fill
            alt=""
            sizes="(max-width: 768px) 100vw, 70vw"
            priority
            onLoad={() => setOnLoadComplete(true)}
          />
        </figure>
        <div className="flex items-center justify-center absolute top-5 right-5 z-20 stroke-white hover:stroke-white/50 cursor-pointer">
          <button onClick={()=> setObjectFit((prev) => prev === 'object-contain' ? 'object-cover' : 'object-contain')}>{objectFit === "object-cover" ? <CollapseIcon className="w-8" /> : <ExpandIcon className="w-8" />}</button>
          <button onClick={() => setFile(null)}><DeleteIcon className="w-8 stroke-white hover:stroke-white/50 cursor-pointer" /></button>
        </div>
      </div>
    );
}
