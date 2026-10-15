import { Post } from "@/types/Post";
import Image from "next/image";
import LikeIndicator from "../indicators/LikeIndicator";
import Link from "next/link";
import ViewCount from "@/app/posts/[id]/_components/view/ui/ViewCount";
export default function PhotoPost({ item }: { item: Post }) {
  return (
    <article className="group w-full">
      <Link href={`/posts/${item.id}`} className="block rounded-lg">
        <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-line">
          <Image
            src={item.imageUrl}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 25vw"
            alt={item.title}
            loading="lazy"
          />
        </figure>
        <div className="flex items-center justify-between gap-3 px-0.5 pt-3">
          <p className="truncate font-serif text-[1.0625rem] leading-snug text-ink">
            {item.title}
          </p>
          <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
            <LikeIndicator length={item.likeCount ?? 0} />
            <ViewCount className="w-3.5" view={item.view} />
          </div>
        </div>
      </Link>
    </article>
  );
}
