export default function PostTitle({title} : {title: string}){

    return(
        <>
            <p className="p-2 text-xl md:text-6xl">{title}</p>
        </>
    )
}