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

const ReviewFilter = ({ book = undefined, bookStatus }) => {
  const { selectedRating, currentPage, maxPage, maxItems, reviewsIsLoading, reviewsStatus } = useReviewQuery();
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
      {bookStatus != "success" ? (
        <SkeletonLoader height="6" width="28" />
      ) : (
        <div className="text-2xl">{book.rating_star} Star</div>
      )}
      {bookStatus != "success" ? (
        <SkeletonLoader width="80" className="my-3" />
      ) : (
        <div className="flex">
          <div className="px-2 underline underline-offset-2 font-bold">
            (3,135)
          </div>
          <div className="flex divide-x-2 divide-gray-800">
            <div className="px-2 underline underline-offset-2">5 star ({})</div>
            <div className="px-2 underline underline-offset-2">4 star ({})</div>
            <div className="px-2 underline underline-offset-2">3 star ({})</div>
            <div className="px-2 underline underline-offset-2">2 star ({})</div>
            <div className="px-2 underline underline-offset-2">1 star ({})</div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        {reviewsIsLoading ? (
          <SkeletonLoader width="36"/>
        ) : reviewsStatus == "success" && (
          <div>{`Showing ${currentPage}-${maxPage} of ${maxItems} reviews`}</div>
        )}
        <div className="flex gap-5">
          <SortDropdown />
          <ShowDropdown />
        </div>
      </div>
    </>
  );
};

export default ReviewFilter;
