"use client"
import EditIcon from "@/components/icons/EditIcon"

export default function PostEditButton({ onEdit }: { onEdit: () => Promise<void> }) {


    return <button onClick={onEdit} className="icon-btn" aria-label="Edit post"><EditIcon className="w-5" /></button>
}
