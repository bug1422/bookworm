import { useReviewQuery } from "@/components/context/useReviewQueryContext";
import { useSearch } from "@/components/context/useSearch";
import OptionDropdown from "@/components/dropdown/option";
import SkeletonLoader from "@/components/fallback/skeletonLoader";

const SortDropdown = () => {
  const { reviewSortOptions } = useSearch();
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
  const { pagingOptions } = useSearch();
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
  const reviewCountDict = book.review_count_by_rating
  return (
    <>
      <div className="my-3">
        <span className="font-bold text-xl">Customer Reviews</span>
        {selectedRating !== undefined && (
          <span className="text-gray-200 text-sm">
            (Filtered by {selectedRating} star)
          </span>
        )}
      </div>
      {bookIsLoading ? (
        <SkeletonLoader height="6" width="28" />
      ) : (
        <div className="text-2xl mb-1">
          {book.rating_star ? `${book.rating_star} Star` : "No Rating"}{" "}
        </div>
      )}
      {bookIsLoading ? (
        <SkeletonLoader width="80" className="my-3" />
      ) : (
        <div className="flex select-none mb-1">
          <div
            className="px-2 underline underline-offset-2 font-bold cursor-pointer"
            onClick={() => {if(book.total_review != 0) setSelectedRating(undefined)}}
          >
            ({book.total_review})
          </div>
          <div className="flex divide-x-2 divide-gray-800">
            <div className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500" onClick={() => {if(reviewCountDict[5] != 0) setSelectedRating(5)}}>
              5 star ({reviewCountDict[5]})
            </div>
            <div className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500" onClick={() => {if(reviewCountDict[4] != 0) setSelectedRating(4)}}>
              4 star ({reviewCountDict[4]})
            </div>
            <div className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500" onClick={() => {if(reviewCountDict[3] != 0) setSelectedRating(3)}}>
              3 star ({reviewCountDict[3]})
            </div>
            <div className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500" onClick={() => {if(reviewCountDict[2] != 0) setSelectedRating(2)}}>
              2 star ({reviewCountDict[2]})
            </div>
            <div className="px-2 underline underline-offset-2 cursor-pointer hover:text-gray-500" onClick={() => {if(reviewCountDict[1] != 0) setSelectedRating(1)}}>
              1 star ({reviewCountDict[1]})
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        {reviewsIsLoading ? (
          <SkeletonLoader width="36" />
        ) : (
          reviewsStatus == "success" &&
          maxPage !== 0 && (
            <div>{`Showing ${currentPage}-${maxPage} of ${maxItems} reviews`}</div>
          )
        )}
        <div className="ms-auto flex gap-5">
          <SortDropdown />
          <ShowDropdown />
        </div>
      </div>
    </>
  );
};

export default ReviewFilter;
