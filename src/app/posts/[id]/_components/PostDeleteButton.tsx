"use client"

export default function PostDeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {


    return <button onClick={onDelete} className="text-black z-50 bg-red-700">DELETE</button>
}
