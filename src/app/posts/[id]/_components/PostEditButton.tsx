"use client"
import EditIcon from "@/components/icons/EditIcon"

export default function PostEditButton({ onEdit }: { onEdit: () => Promise<void> }) {


    return <button onClick={onEdit} className="text-studio-dim hover:text-studio-lime transition-colors z-50 cursor-pointer"><EditIcon className="w-8" /></button>
}
