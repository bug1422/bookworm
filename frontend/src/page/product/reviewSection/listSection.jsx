import { useReviewQuery } from "@/components/context/useReviewQueryContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import { formatDateString } from "@/lib/utils";

const ReviewItem = ({ review = undefined }) => {
  return (
    <div>
      {review == undefined ? (
        <div className="flex flex-col gap-2">
          <SkeletonLoader width="36" />
          <SkeletonLoader width="100%" />
          <SkeletonLoader width="100%" />
          <SkeletonLoader width="24" />
        </div>
      ) : (
        <>
          <div className="flex gap-2 divide-x-1 divide-gray-800 items-center">
            <div className="font-bold text-xl pe-2">{review.review_title}</div>
            <div>{review.rating_star} stars</div>
          </div>
          <p>{review.review_details}</p>
          <div>{formatDateString(review.review_date)}</div>
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

const ReviewList = () => {
  const { reviews, reviewsIsLoading, reviewsStatus } = useReviewQuery();
  return (
    <div className="relative w-full my-4 flex flex-col divide-y-2 gap-8 min-h-80">
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
          <div className="text-base italic">If you've read it, we'd love to hear your thoughts!</div>
        </MessageBox>
      ) : (
        <>
          {reviews.map((v, k) => (
            <ReviewItem key={k} review={v} />
          ))}
        </>
      )}
    </div>
  );
};

export default ReviewList;
