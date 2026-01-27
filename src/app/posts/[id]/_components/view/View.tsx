import { useEffect } from "react"

export default function View(){
    useEffect(()=>{
        localStorage.setItem('LastView', new Date().toISOString())
    },[])
    return(
        <>
        
        </>
    )
}