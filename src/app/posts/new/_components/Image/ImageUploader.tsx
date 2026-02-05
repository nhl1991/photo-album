import UploadIcon from "@/components/icons/UploadIcon";
import ImagePreview from "./ImagePreview";
import { getGPS } from "@/utils/exif-utils";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { GeocodeResults, Geometry } from "@/types/Geocode";

export default function ImageUploader({setFile, setGeocodeResults, setOnLoadComplete} : { setFile:Dispatch<SetStateAction<File | null>>, setGeocodeResults: Dispatch<SetStateAction<GeocodeResults | undefined>>,
  setOnLoadComplete: Dispatch<SetStateAction<boolean>>
}) {
  // Image Uploader start
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
