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
      alert("You can upload less than 10MB.");
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
      <span className="">
        <label
          htmlFor="file"
          className="flex flex-col items-center justify-center cursor-pointer\"
        >
          <UploadIcon className="w-12 h-12 stroke-gray-500" />
          <p>Upload your photo.</p>
        </label>
        <input
          type="file"
          id="file"
          className="hidden"
          ref={fileRef}
          onChange={handleOnFileInput}
          accept="image/*"
        />
      </span>
    </>
  );
}
