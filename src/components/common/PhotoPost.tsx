import { Post } from "@/types/Post";
import Image from "next/image";
import LikeIndicator from "../indicators/LikeIndicator";
import Link from "next/link";
import ViewCount from "@/app/posts/[id]/_components/view/ui/ViewCount";

export default function PhotoPost({
  item,
  index,
}: {
  item: Post;
  index?: number;
}) {
  const shortId = item.id.slice(0, 6).toUpperCase();

  return (
    <article className="group relative bg-studio-panel border border-studio-line rounded-lg overflow-hidden transition-colors hover:border-studio-lime-deep focus-within:border-studio-lime-deep">
      <Link href={`posts/${item.id}`} className="block focus:outline-none">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.imageUrl}
            fill
            className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.06] group-focus-within:scale-[1.06]"
            sizes="(max-width: 768px) 45vw, 22vw"
            alt={item.title}
            loading="lazy"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-b from-transparent via-transparent to-studio-bg/95 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity text-studio-text">
            <span className="font-mono-ui text-[10px] text-studio-lime mb-1">
              IMG_{shortId}
            </span>
            <div className="flex items-center gap-2.5 font-mono-ui text-[11px]">
              <LikeIndicator length={item.likeCount ?? 0} />
              <ViewCount className="w-4" view={item.view} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-studio-line">
          <span className="text-[13px] font-medium text-studio-text truncate">
            {item.title}
          </span>
          {typeof index === "number" && (
            <span className="font-mono-ui text-[10px] text-studio-dim shrink-0">
              {String(index).padStart(2, "0")}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
