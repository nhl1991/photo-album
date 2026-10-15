import UploadIcon from "@/components/icons/UploadIcon";
import { Dispatch, SetStateAction, useRef } from "react";


export default function ImageUploader({
  setFile,
}: {
  setFile: Dispatch<SetStateAction<File | null>>;
}) {
  // Image Uploader start
  const fileRef = useRef<HTMLInputElement>(null);
  const handleOnFileInput = async () => {
    if (!fileRef || !fileRef.current) return;
    const { files } = fileRef.current;
    if (!files) return;
    if (files[0].size > 1024 * 1024 * 10) {
      alert("10MB 이하의 파일만 업로드할 수 있습니다.");
      return;
    }
    const selected = files[0];

    setFile(selected);
    // const gps = await getGPS(selected);
    // if (gps) {
    //   const response = await fetch("/api/geocode", {
    //     method: "POST",
    //     body: JSON.stringify({ gps }),
    //   });

    //   const { results } = await response.json();
    //   setGeocodeResults(results);
    //   if (selected) {
    //     const imageUrl = URL.createObjectURL(selected);
    //     setPreview(imageUrl);
    //     // setPreview(imageUrl);
    //   }
    // }
  };

  // Image Uploader end

  return (
    <>
      <span className="absolute inset-0 has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-4 has-[:focus-visible]:outline-accent">
        <label
          htmlFor="file"
          className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted transition-colors hover:text-ink cursor-pointer"
        >
          <UploadIcon className="w-10 h-10" />
          <p className="text-sm">사진을 업로드하세요.</p>
        </label>
        <input
          type="file"
          id="file"
          className="sr-only"
          ref={fileRef}
          onChange={handleOnFileInput}
          accept="image/*"
        />
      </span>
    </>
  );
}
