export default function PostContent({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <>
      <p className="text-[2rem]">{title}</p>
      <p className="text-[1rem]">{body}</p>
    </>
  );
}
