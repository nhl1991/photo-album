import Link from "next/link";
import ButtonContainer from "./ButtonContainer";


export default function PasswordManage(){


    return(
        <ButtonContainer>
            <Link href={'account/password'}>
                <p className="rounded-2xl px-4 py-1 font-semibold">CHANGE PASSWORD</p></Link>
        </ButtonContainer>
    )
}
