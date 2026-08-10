
export default function PostsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full grid grid-cols-2 studio:grid-cols-4 gap-3 md:gap-4 p-4 md:px-[34px] md:pb-20 ">
      {children}
    </div>
  );
}