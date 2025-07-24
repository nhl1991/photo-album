import Image from "next/image";


export default function ImageSection({ image }: { image: string }) {


    return (
            <div className="w-full h-full relative">
                <Image className="relative" src={image} objectFit="contain" fill alt="none" />
            </div>
    )
}