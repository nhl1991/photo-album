import { User, updateProfile } from "firebase/auth";
import { ChangeEvent, useState } from "react";


export default function DisplayName({ user }: { user: User | null }) {

    const [isEdit, setIsEdit] = useState(false); // boolean for Edit Display name.
    const [username, setUsername] = useState<string>("")
    const onClick = async () => {
        if (!user) return;
        //Switch to Edit.
        if (isEdit === false)
            setIsEdit(true);
        else {

            await updateProfile(user,
                { displayName: username })
            setIsEdit(false);
        }
    }

    const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    return (
        <div className={`flex border-2 rounded-2xl px-1 ${isEdit ? 'border-white' : 'border-black'}`}>

            {isEdit ? <input id="nickname" className="w-72 text-2xl px-4 py-1 text-center outline-0 focus:bg-transparent active:bg-transparent" type="text" placeholder={user?.displayName ? user.displayName : "Anonymous"} onChange={onChangeUsername} />
                : <label htmlFor="nickname" className="w-max text-2xl px-2 py-1 text-center">
                    {user?.displayName ? user.displayName : "Anonymous"}
                </label>}

            <button className="relative w-8 m-1" onClick={onClick}>
                {isEdit ? <svg className="w-6" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg> :
                    <svg className="w-6" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>}
            </button>
        </div>
    )
}