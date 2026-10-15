"use client"
import EditIcon from "@/components/icons/EditIcon"

export default function PostEditButton({ onEdit }: { onEdit: () => Promise<void> }) {


    // Editing is not implemented yet, so the button stays disabled.
    return <button onClick={onEdit} className="icon-btn" aria-label="게시물 수정 (준비 중)" title="준비 중" disabled><EditIcon className="w-5" /></button>
}
