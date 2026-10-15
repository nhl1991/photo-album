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
      <h1 className="font-serif text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-[1.1] tracking-tight text-ink">{title}</h1>
      <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink/85 md:text-lg">{body}</p>
    </>
  );
}
