
export default function LikeCount({ likeCount}: { likeCount: number}){
    // useEffect(()=>{},[likeCount])

    return(
        <p>{likeCount ?? 0}</p>
    )
}