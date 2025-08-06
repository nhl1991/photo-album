


export default function ModalWrapper({ children }: {
    children: React.ReactNode
}) {





    return (
        <div className="min-w-screen min-h-screen bg-white/30 fixed top-0 left-0 flex items-center justify-center rounded-2xl z-50" >
            {children}
        </div>
    )
}