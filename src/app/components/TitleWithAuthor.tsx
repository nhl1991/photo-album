

export default function TitleWithAuthor({title, username}: {
    title: string,
    username: string,
}){


    return(
        <div className="w-full h-max p-2 flex flex-col items-center justify-center">
            <p className="w-full text-center font-bold">{username}</p>
            <p className="w-full text-center">{title}</p>

        </div>
        )
}