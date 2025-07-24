import Post from "./Post";
import { iPosts } from "../utils/interface";
import LikeButton from "./buttons/LikeButton";
import View from "./buttons/ViewComponent";
import { TimeConverter } from "../utils/time-conversion";
import CommentIndicator from "./buttons/CommentIndicator";
import PostCardWrapper from "./PostCardWrapper";
import TitleWithAuthor from "./TitleWithAuthor";



export default function Timeline({ posts }: {
    posts: iPosts[]
}) {
    // const [posts, setPosts] = useState<iPosts[]>([])

    // <boolean & Dispatch<SetStateAction<boolean>>>({showModal, setShowModal});





    return (
        <>
            {
                posts.map((post) => {
                    return <div key={post.id} className="relative" >

                        <PostCardWrapper>
                            <Post {...post} />
                            <TitleWithAuthor title={post.title} username={post.username} />
                        </PostCardWrapper>

                        <div className="w-full flex flex-col justify-center items-center gap-2">
                            <div className="flex">
                                <LikeButton id={post.id} like={post.like} length={post.likes} />
                                <View view={post.view} />
                                <CommentIndicator length={post.comments ? post.comments.length : 0} />
                            </div>
                            <div className="">
                                <p className="text-white/50">{TimeConverter(post.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                })

            }


        </>
    )
}

