import { Post } from "@/types/Post";
import Image from "next/image";
import LikeIndicator from "../indicators/LikeIndicator";
import Link from "next/link";
import ViewCount from "@/app/posts/[id]/_components/view/ui/ViewCount";
export default function PhotoPost({ item }: { item: Post }) {
  return (
    <article className="w-full h-full overflow-hidden cursor-pointer hover:scale-110 transition-all duration-300 place-items-center p-2 bg-black dark:bg-white text-white  dark:text-black">
      <Link href={`posts/${item.id}`}>
        <div className="h-full flex flex-col justify-between">
          <figure className="w-60 h-48 relative">
            <Image
              src={item.imageUrl}
              fill
              className="object-cover "
              sizes="(max-width: 768px) 33vw, 20vw"
              alt={item.title}
              loading="lazy"
            />
          </figure>
          <div className="flex flex-col items-center justify-center py-4 text-2xl">
            <p>{item.title}</p>
            <div className="text-xs flex">
              <LikeIndicator length={item.likeCount ?? 0} />
              <ViewCount className="w-4 md:w-4" view={item.view} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
