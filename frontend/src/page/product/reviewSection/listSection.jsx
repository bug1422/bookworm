import { useReviewQuery } from "@/components/context/useReviewQueryContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";

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
          <div className="flex gap-2 divide-y-2">
            <div>{review.review_title}</div>
            <div>{review.rating_star} stars</div>
          </div>
          <p>{review.review_description}</p>
          <div>{review.review_date}</div>
        </>
      )}
    </div>
  );
};

const ErrorGrid = () => {
  return (
    <div className="flex flex-col text-4xl absolute top-1/3 -translate-x-1/2 left-1/2">
      Server is down at the moment
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
        <ErrorGrid />
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
