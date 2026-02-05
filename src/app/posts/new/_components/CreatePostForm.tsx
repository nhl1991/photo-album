import { FormState } from "@/types/Form";
import { Dispatch, SetStateAction, useRef } from "react";

export default function CreatePostForm({setForm} : {setForm: Dispatch<SetStateAction<FormState>>}) {
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.currentTarget;
  setForm(prev => ({ ...prev, [name]: value }));
};
  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-4">
      <input
        className="w-full rounded-xl border-2 px-3 py-1"
        type="text"
        name="title"
        placeholder="Write your title"
        onChange={handleChange}
      />
      <textarea
        name="content"
        className="w-full h-96 flex flex-col items-center justify-center rounded-xl border-2 px-3 py-1 resize-none"
        placeholder="Write your content"
        onChange={handleChange}
      ></textarea>
    </div>
  );
}
