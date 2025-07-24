

export default function CommentCount({length}: {length:number}) {


    return (
        <div className="w-full h-full px-2 rounded-2xl flex items-center">
            <p className="px-2 text-xs md:text-base">현재 <b>{length}개</b>의 코멘트가 있습니다.</p>
        </div>
    )
}