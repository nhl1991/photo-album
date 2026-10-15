export default function PostsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
      {children}
    </div>
  );
}
