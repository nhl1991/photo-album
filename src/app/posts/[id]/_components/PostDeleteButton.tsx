"use client"

import DeleteIcon from "@/components/icons/DeleteIcon"

export default function PostDeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {


    return <button onClick={onDelete} className="icon-btn hover:text-danger" aria-label="Delete post"><DeleteIcon className="w-5" /></button>
}
