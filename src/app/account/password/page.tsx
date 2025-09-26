'use client'
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce";


export default function Page() {
    const password_current = useRef<HTMLInputElement>(null);
    const [isValid, setIsValid] = useState(false);

    const checkPassword = async (password: string) => {
        const user = auth.currentUser;
        if (!user || !user.email) return false;

        const credential = EmailAuthProvider.credential(user.email, password);

        try {
            await reauthenticateWithCredential(user, credential);
            // ✅ 비밀번호 일치 (검증 성공)
            return true;
        } catch (error) {
            // ❌ 비밀번호 불일치 또는 만료된 세션
            if(error instanceof FirebaseError){
                console.log(error);
            }
            return false;
        }
    };
    
    const onCheckCurrentPassword = useDebouncedCallback(async () => {

        if (password_current.current instanceof HTMLInputElement) {
            const result = await checkPassword(password_current.current.value);
            setIsValid(result);
        }
    }, 300)

    return (
        <div className="w-full h-full flex justify-center items-center ">
            <div className="w-1/2 h-[90vh] p-4 ">
                <div className="w-full h-full flex flex-col justify-evenly items-center p-4 gap-3.5">

                    {isValid ? <NewPasswordForm /> : <div>
                        <Message>현재 비밀번호를 입력하세요.</Message>
                        <div className="flex">
                            <input className="w-64 border-b-2 border-white focus:outline-0 py-1" id="password_current" type="password" ref={password_current} onChange={onCheckCurrentPassword} autoComplete="false" />
                            <svg className={`w-8 ${isValid ? 'stroke-sky-400' : 'stroke-gray-600'}`} data-slot="icon" fill="none" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>}
                </div>


            </div>
        </div>
    )
}

function NewPasswordForm() {
    const router = useRouter();
    const user = auth.currentUser;
    const password_new = useRef<HTMLInputElement>(null);
    const password_confirm = useRef<HTMLInputElement>(null);
    const [isComplete, setIsComplete] = useState(false);





    const onChangePassword = () => {
        if (password_new.current && password_confirm.current) {
            if (password_new.current.value === password_confirm.current.value) {
                setIsComplete(true);
            } else {
                setIsComplete(false);
            }
        }
    }

    const onSubmit = async () => {
        if (!user) return;
        if (!password_confirm.current) return;

        try {
            await updatePassword(user, password_confirm.current.value);
            router.push('/')
        } catch (error) {
            if (error instanceof FirebaseError)
                console.log(error);
        }
    }

    return (
        <form className="w-full h-full" onSubmit={onSubmit}>

            <Message>새 비밀번호를 입력하세요.</Message>
            <input className="w-64 border-b-2 border-white focus:outline-0 py-1" id="password_new" type="password" ref={password_new} placeholder="새로운 비밀번호를 입력하세요." onChange={onChangePassword} autoComplete="false" />


            <Message>새 비밀번호를 다시 한번 입력하세요.</Message>
            <input className="w-64 border-b-2 border-white focus:outline-0 py-1" id="passowrd_confirm" type="password" ref={password_confirm} placeholder="한번 더 입력하세요." onChange={onChangePassword} autoComplete="false" />


            <button type="submit" className={`w-max h-max p-2 rounded-xl ${isComplete ? 'bg-sky-400 cursor-pointer' : 'bg-sky-400/20'}`}>비밀번호 변경</button>

        </form>
    )
}

function Message({ children }: {
    children: React.ReactNode
}) {

    return (
        <>

            <p className="text-2xl font-bold my-4">{children}</p>
        </>
    )
}