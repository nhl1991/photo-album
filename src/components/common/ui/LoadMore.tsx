import ChevronDoubleDown from "@/components/icons/ChevronDoubleDown";
import ThreeDotsBounce from "@/components/icons/ThreeDotsBounce";
import FeedEndNotice from "./FeedEndNotice";

export default function LoadMore({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-center py-12">
      {hasNextPage ? (
        isFetchingNextPage ? (
          <span role="status" aria-label="Loading more" className="text-accent">
            <ThreeDotsBounce className="h-8 w-12" />
          </span>
        ) : (
          <button
            className="btn-secondary min-h-12 w-full max-w-64"
            onClick={onLoadMore}
          >
            Show more
            <ChevronDoubleDown className="w-4" />
          </button>
        )
      ) : (
        <FeedEndNotice />
      )}
    </div>
  );
}
