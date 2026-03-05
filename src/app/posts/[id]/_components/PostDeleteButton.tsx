"use client"

import DeleteIcon from "@/components/icons/DeleteIcon"

export default function PostDeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {


    return <button onClick={onDelete} className="text-black z-50 "><DeleteIcon className="w-8" /></button>
}
