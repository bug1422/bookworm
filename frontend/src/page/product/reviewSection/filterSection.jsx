import { useReviewQuery } from "@/components/context/useReviewQueryContext";
import { useOptions } from "@/components/context/useOptionsContext";
import OptionDropdown from "@/components/dropdown/option";
import SkeletonLoader from "@/components/fallback/skeletonLoader";

const SortDropdown = () => {
  const { reviewSortOptions } = useOptions();
  const { sortOption, setQueryState } = useReviewQuery();
  var sortIsUnavail =
    reviewSortOptions === undefined || reviewSortOptions.length == 0;
  return (
    <OptionDropdown
      onSelect={(v) => {
        if (curValue !== sortOption[0]) {
          setQueryState((prev) => ({
            ...prev,
            sortOption: opt,
          }));
        }
      }}
      options={reviewSortOptions}
      selectedOption={sortOption}
      disabled={sortIsUnavail}
    />
  );
};

const ShowDropdown = () => {
  const { pagingOptions } = useOptions();
  const { pagingOption, setQueryState } = useReviewQuery();
  var pagingIsUnavail =
    pagingOptions === undefined || pagingOptions.length == 0;
  return (
    <OptionDropdown
      onSelect={(v) => {
        if (curValue !== pagingOption[0]) {
          setQueryState((prev) => ({
            ...prev,
            pagingOption: opt,
          }));
        }
      }}
      options={pagingOptions}
      selectedOption={pagingOption}
      disabled={pagingIsUnavail}
    />
  );
};

const ReviewFilter = ({ book = undefined, bookIsLoading = true }) => {
  const {
    selectedRating,
    currentPage,
    maxPage,
    maxItems,
    reviewsIsLoading,
    reviewsStatus,
    setQueryState,
  } = useReviewQuery();
  const setSelectedRating = (value) => {
    setQueryState((prev) => ({
      ...prev,
      selectedRating: value,
    }));
  };
  const reviewCountDict = book.review_count_by_rating;
  return (
    <>
      <div className="my-3 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <span className="font-bold text-xl">Customer Reviews</span>
        {selectedRating !== undefined && (
          <span className="text-gray-500 text-sm">
            (Filtered by {selectedRating} star)
          </span>
        )}
      </div>
      {bookIsLoading ? (
        <SkeletonLoader height="6" width="28" />
      ) : (
        <div className="text-2xl mb-1">
          {book.rating_star ? (
            <>
              <span className="font-bold">{book.rating_star}</span> Star
            </>
          ) : (
            "No Rating"
          )}
        </div>
      )}
      {bookIsLoading ? (
        <SkeletonLoader width="80" className="my-3" />
      ) : (
        <div className="flex flex-wrap gap-2 select-none mb-1">
          <div
            className="px-2 underline underline-offset-2 font-bold cursor-pointer"
            onClick={() => {
              if (book.total_review !== 0) setSelectedRating(undefined);
            }}
          >
            Total: ( {book.total_review})
          </div>
          <div className="text-center flex gap-2 divide-x-2 divide-gray-800">
            <div
              className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500"
              onClick={() => {
                setSelectedRating(5);
              }}
            >
              5 star ({reviewCountDict[5]})
            </div>
            <div
              className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500"
              onClick={() => {
                setSelectedRating(4);
              }}
            >
              4 star ({reviewCountDict[4]})
            </div>
            <div
              className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500"
              onClick={() => {
                setSelectedRating(3);
              }}
            >
              3 star ({reviewCountDict[3]})
            </div>
            <div
              className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500"
              onClick={() => {
                setSelectedRating(2);
              }}
            >
              2 star ({reviewCountDict[2]})
            </div>
            <div
              className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500"
              onClick={() => {
                setSelectedRating(1);
              }}
            >
              1 star ({reviewCountDict[1]})
            </div>
          </div>
        </div>
      )}
      <div className="mb-4 flex flex-wrap justify-center md:justify-between gap-y-2text-center md:text-left">
        {reviewsIsLoading ? (
          <SkeletonLoader width="36" />
        ) : (
          reviewsStatus == "success" && (
            <div className="w-full sm:w-auto">
              {maxPage == 0
                ? "Showing no review"
                : `Showing ${currentPage}-${maxPage} of ${maxItems} reviews`}
            </div>
          )
        )}
        <div className="flex flex-col sm:flex-row justify-around w-full md:w-auto gap-4 ml-auto">
          <SortDropdown />
          <ShowDropdown />
        </div>
      </div>
    </>
  );
};

export default ReviewFilter;
