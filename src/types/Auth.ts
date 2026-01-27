import { User } from "firebase/auth"
import { Dispatch, SetStateAction } from "react"

export type AuthUser = User|null|undefined

export type AuthState = {
    user: AuthUser,
    setUser: Dispatch<SetStateAction<AuthUser>>
}