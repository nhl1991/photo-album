"use client"
export default function PostContent({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <>
      <p className="text-[2rem] font-display text-studio-text">{title}</p>
      <p className="text-[1rem] px-4 text-studio-dim">{body}</p>
    </>
  );
}
