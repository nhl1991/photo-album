
export default function PostsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:max-w-7xl w-full grid grid-cols-[repeat(2,minmax(96px,1fr))] md:grid-cols-[repeat(4,minmax(96px,256px))] grid-rows-[repeat(auto-fit,minmax(96px,320px))] gap-x-2 md:gap-x-4 gap-y-8 p-4 ">
      {children}
    </div>
  );
}