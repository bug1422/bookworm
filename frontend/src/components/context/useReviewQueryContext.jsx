import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useSearch } from "./useSearch";
import { fetchBookReviewsByQuery } from "@/api/book";
const ReviewQueryContext = createContext();

export const ReviewQueryProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const { pagingOptions, reviewSortOptions, optionsStatus } = useSearch();
  const [queryState, setQueryState] = useState({
    bookId: null,
    selectedRating: null,
    sortOption: null,
    pagingOption: null,
    currentPage: null,
    maxPage: null,
    maxItems: null,
  });

  const FetchReviews = async () => {
    const {
      sortOption,
      selectedRating,
      pagingOption,
      currentPage,
      bookId,
    } = queryState;
    const reviewList = await fetchBookReviewsByQuery(
      bookId,
      selectedRating,
      sortOption,
      pagingOption,
      currentPage
    );
    if (reviewList.data) {
      const data = reviewList.data
      setQueryState((prev) => ({
        ...prev,
        maxPage: data.max_page,
        maxItems: data.max_items,
      }));
      return data.items;
    }
    throw reviewList.error
  };

  const queryKey = [
    "review-list-" + queryState.bookId,
    {
      selectedRating: queryState.selectedRating,
      sortOption: queryState.sortOption,
      pagingOption: queryState.pagingOption,
      currentPage: queryState.currentPage,
    },
  ]
  const {
    data: reviews,
    isLoading,
    status,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => FetchReviews(),
    enabled: optionsStatus == "success" && queryState.bookId !== null,
    retryOnMount: true,
    retry: 3,
    retryDelay: 2000,
  });

  const refetchReviews = async () => {
    queryClient.invalidateQueries(queryKey)
  }
  const reviewsStatus = optionsStatus == "error" ? "error" : status;
  const reviewsIsLoading =
    optionsStatus == "pending" || reviewsStatus == "pending";

  useEffect(() => {
    const defaultSortOption = reviewSortOptions?.find(
      (opt) => opt[0] == "newest-date"
    );
    if (defaultSortOption != null) {
      setQueryState((prev) => ({
        ...prev,
        sortOption: defaultSortOption,
      }));
    }
  }, [reviewSortOptions]);

  useEffect(() => {
    const defaultPaging = pagingOptions?.find((opt) => opt[0] == "20");
    if (defaultPaging != null) {
      setQueryState((prev) => ({
        ...prev,
        pagingOption: defaultPaging,
      }));
    }
  }, [pagingOptions]);

  useEffect(() => {
    setQueryState((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, [
    queryState.selectedRating,
    queryState.sortOption,
    queryState.pagingOption,
  ]);

  return (
    <ReviewQueryContext.Provider
      value={{
        ...queryState,
        reviews,
        reviewsIsLoading,
        reviewsStatus,
        setQueryState,
        refetchReviews
      }}
    >
      {children}
    </ReviewQueryContext.Provider>
  );
};

export const useReviewQuery = () => {
  return useContext(ReviewQueryContext);
};
