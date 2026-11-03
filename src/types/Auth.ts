import { User } from "firebase/auth"
import { Dispatch, SetStateAction } from "react"


export type AuthUser = User|null|undefined

export type AuthState = {
    user: AuthUser,
    status:string,
    setUser: Dispatch<SetStateAction<AuthUser>>,
    profile: Profile,
    refreshProfile: () => void,
}

export type Profile = { displayName: string | null; photoURL: string | null } | null