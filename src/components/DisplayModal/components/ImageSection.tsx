import Image from "next/image";


export default function ImageSection({ image }: { image: string }) {


    return (
            <div className="w-full h-full relative aspect-[4/3] md:aspect-[16/9]">
                <Image className="relative object-contain" sizes="(max-width: 500px) 100vw,
             (max-width: 1024px) 50vw,
             33vw" src={image} fill alt="none" />
            </div>
    )
}