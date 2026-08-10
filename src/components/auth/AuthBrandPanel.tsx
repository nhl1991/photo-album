"use client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { QueryData } from "@/types/Post";

const fetchMosaicImages = async (): Promise<string[]> => {
  try {
    const response = await fetch("/api/posts");
    if (!response.ok) return [];
    const result = await response.json();
    const items: QueryData[] = result.items ?? [];
    return items.slice(0, 5).map((item) => item.imageUrl);
  } catch {
    return [];
  }
};

export default function AuthBrandPanel({
  quote,
  highlight,
}: {
  quote: string;
  highlight: string;
}) {
  const { data } = useQuery({
    queryKey: ["auth/mosaic"],
    queryFn: fetchMosaicImages,
    retry: false,
  });

  const images = data ?? [];
  const slots = Array.from({ length: 5 }, (_, i) => images[i]);

  return (
    <div className="w-full md:flex-1 max-[880px]:flex-none md:max-w-[560px] bg-studio-panel border-r border-studio-line max-[880px]:border-r-0 max-[880px]:border-b flex flex-col justify-between p-10 max-[880px]:p-7 font-display text-studio-text">
      <div className="flex items-center gap-2 font-semibold text-lg">
        <span className="w-2 h-2 rounded-full bg-studio-lime shrink-0" />
        FRAME.
      </div>

      <div className="grid grid-cols-3 gap-2 my-8 max-[880px]:hidden">
        {slots.map((src, i) => (
          <div
            key={i}
            className={`relative rounded-md overflow-hidden border border-studio-line bg-studio-panel-2 ${
              i === 0 ? "row-span-2 aspect-[1/2.08]" : "aspect-square"
            }`}
          >
            {src ? (
              <Image
                src={src}
                fill
                alt=""
                sizes="200px"
                className="object-cover [filter:saturate(0.75)_brightness(0.8)]"
              />
            ) : null}
          </div>
        ))}
      </div>

      <p className="font-display text-[26px] max-[880px]:text-xl font-medium leading-[1.35] max-w-[38ch]">
        {quote}
        <span className="text-studio-lime">{highlight}</span>
      </p>
    </div>
  );
}
