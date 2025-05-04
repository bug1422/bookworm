import { useReviewQuery } from "@/components/context/useReviewQueryContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import { cn, formatDateString } from "@/lib/utils";
import { useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ReviewItem = ({ review = undefined }) => {
  return (
    <div className="mt-4 pb-4">
      {review === undefined ? (
        <div className="flex flex-col gap-4">
          <SkeletonLoader width="36" />
          <SkeletonLoader width="100%" />
          <SkeletonLoader width="100%" />
          <SkeletonLoader width="24" />
        </div>
      ) : (
        <>
          <div className="flex gap-2 divide-x-2 divide-gray-800 items-center mb-2">
            <div className="font-bold text-xl pe-2">{review.review_title}</div>
            <div>{review.rating_star} stars</div>
          </div>
          <p className="text-base mb-2">{review.review_details}</p>
          <div className="text-sm text-gray-500">
            {formatDateString(review.review_date)}
          </div>
        </>
      )}
    </div>
  );
};

const MessageBox = ({ children }) => {
  return (
    <div className="flex flex-col text-4xl w-3/4 text-center gap-2 absolute top-1/3 -translate-x-1/2 left-1/2">
      {children}
    </div>
  );
};

const ListPagination = ({ className }) => {
  const { currentPage, maxPage, setQueryState } = useReviewQuery();
  useEffect(() => {
    setCurrentPage(1);
  }, []);
  const setCurrentPage = (page) => {
    setQueryState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };
  return (
    <Pagination className={cn("h-16", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="select-none cursor-pointer"
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="select-none cursor-pointer"
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          >
            {currentPage > 1 && currentPage - 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="select-none cursor-pointer" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="select-none cursor-pointer"
            onClick={() => {
              if (currentPage < maxPage) setCurrentPage(currentPage + 1);
            }}
          >
            {currentPage < maxPage && currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="select-none cursor-pointer"
            onClick={() => {
              if (currentPage < maxPage) setCurrentPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const ReviewList = () => {
  const { reviews, reviewsIsLoading, reviewsStatus } = useReviewQuery();
  return (
    <div className="relative w-full mt-6 mb-4 flex flex-col divide-y-2 divide-white min-h-80">
      {reviewsIsLoading ? (
        <>
          {Array(3)
            .fill(0)
            .map((v, k) => (
              <ReviewItem key={k} />
            ))}
        </>
      ) : reviewsStatus == "error" ? (
        <MessageBox>Server is down at the moment</MessageBox>
      ) : reviews.length == 0 ? (
        <MessageBox>
          <div>This book hasn't been reviewed yet</div>
          <div className="text-base italic">
            If you've read it, we'd love to hear your thoughts!
          </div>
        </MessageBox>
      ) : (
        <>
          {reviews.map((v, k) => (
            <ReviewItem key={k} review={v} />
          ))}
          <ListPagination className="" />
        </>
      )}
    </div>
  );
};

export default ReviewList;
