import PostsWrapper from "./PostsWrapper";

export default function PhotoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="사진을 불러오는 중">
      <PostsWrapper>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] w-full rounded-lg bg-line" />
            <div className="mt-3 flex items-center justify-between">
              <div className="h-4 w-2/5 rounded bg-line" />
              <div className="h-3 w-1/4 rounded bg-line" />
            </div>
          </div>
        ))}
      </PostsWrapper>
    </div>
  );
}
