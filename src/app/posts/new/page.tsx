"use client"
import { useEffect } from "react";
import CreatePostContainer from "./_components/CreatePostContainer";
import { setOptions } from "@googlemaps/js-api-loader";
import { GOOGLE_API_KEY } from "@/lib/google-api-key";
/**
 *
 * 파일 업로드 컴포넌트
 * 주소 입력 컴포넌트
 * 사진 컴포넌트
 * 제목, 내용 컴포넌트.
 * @returns
 */
export default function Page() {
  useEffect(() => {
    setOptions({
      key: GOOGLE_API_KEY,
    });
  }, []);
  return (
    <>
      <CreatePostContainer />
    </>
  );
}
