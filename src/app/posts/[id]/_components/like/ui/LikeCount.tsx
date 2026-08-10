
export default function LikeCount({ likeCount}: { likeCount: number}){
    // useEffect(()=>{},[likeCount])

    return(
        <p className="font-mono-ui px-2">{likeCount ?? 0}</p>
    )
}