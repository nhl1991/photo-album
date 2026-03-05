"use client"
import EditIcon from "@/components/icons/EditIcon"

export default function PostEditButton({ onEdit }: { onEdit: () => Promise<void> }) {


    return <button onClick={onEdit} className="text-black z-50 "><EditIcon className="w-8" /></button>
}
