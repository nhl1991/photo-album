import { FormState } from "@/types/Form";
import { Dispatch, SetStateAction } from "react";

export default function CreatePostForm({setForm} : {setForm: Dispatch<SetStateAction<FormState>>}) {
    const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.currentTarget;
  setForm(prev => ({ ...prev, [name]: value }));
};
  return (
    <div className="flex w-full flex-col gap-y-5">
      <div>
      <label className="field-label" htmlFor="post-title">Title</label>
      <input
        className="field-input"
        id="post-title"
        type="text"
        name="title"
        placeholder="Write your title"
        onChange={handleChange}
      />
      </div>
      <div>
      <label className="field-label" htmlFor="post-content">Content</label>
      <textarea
        name="content"
        id="post-content"
        className="field-input h-64 resize-none md:h-80"
        placeholder="Write your content"
        onChange={handleChange}
      ></textarea>
      </div>
    </div>
  );
}
