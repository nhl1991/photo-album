"use client"

import DeleteIcon from "@/components/icons/DeleteIcon"

export default function PostDeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {


    return <button onClick={onDelete} className="text-studio-dim hover:text-studio-red transition-colors z-50 cursor-pointer"><DeleteIcon className="w-8" /></button>
}
