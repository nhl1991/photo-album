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
      <label className="field-label" htmlFor="post-title">제목</label>
      <input
        className="field-input"
        id="post-title"
        type="text"
        name="title"
        placeholder="제목을 입력하세요"
        onChange={handleChange}
      />
      </div>
      <div>
      <label className="field-label" htmlFor="post-content">내용</label>
      <textarea
        name="content"
        id="post-content"
        className="field-input h-64 resize-none md:h-80"
        placeholder="내용을 입력하세요"
        onChange={handleChange}
      ></textarea>
      </div>
    </div>
  );
}
