
import Image from "next/image"
import { useEffect } from "react"


export default function ImageSection(
    { 
        image,
        title,
    isPriority }: { 
        image:string,
        title:string,
    isPriority:boolean }
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
                <div className="w-full h-full relative">
                    <div className="w-full h-full relative ">
                        {image ? <Image className=" object-cover rounded-2xl" src={image} fill sizes="(max-width: 768px) 100vw, 33vw" alt={title} priority={isPriority} /> : null}
                    </div>
                </div>
            </>
        )
}
