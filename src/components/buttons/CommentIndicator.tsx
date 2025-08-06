import CommentIcon from "../icons/CommentIcon"


export default function CommentIndicator({ length }: {
    length: number
}) {


    return (

        <div className="flex items-center justify-center">
            <CommentIcon className="w-6" />
            <p className="px-2">{length}</p>
        </div>
    )
}