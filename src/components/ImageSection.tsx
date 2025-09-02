
import { iPost } from "@/types/interface"
import Image from "next/image"
import { useEffect } from "react"


export default function ImageSection(
    { 
        image,
        title }: iPost,
) {
    // const [showModal, setShowModal] = useState(false);
    // const onClick = () => {

    //     const currentView = view + 1;
    //     const ref = getDatabaseRefById(id);
    //     updateView(ref, currentView);
    // }

    useEffect(() => {
    }, [])
        return (
            <>
                <div className="w-full h-full p-1 relative rounded-2xl">
                    <div className="w-full h-48 p-1 relative">
                        {image ? <Image className="rounded-2xl object-cover" src={image} fill sizes="(max-width: 768px) 100vw, 33vw" alt={title} priority /> : null}
                    </div>
                </div>
            </>
        )
}
