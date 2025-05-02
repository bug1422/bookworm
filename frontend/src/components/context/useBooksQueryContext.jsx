import { createContext, useState, useEffect, useContext } from "react";
import { useSearch } from "./useSearch";
import { fetchBooksByQuery } from "@/api/book";
import { useQuery } from "@tanstack/react-query";
const BookQueryContext = createContext();

export const BookQueryProvider = ({ children }) => {
  const { pagingOptions, bookSortOptions, optionsStatus } = useSearch();
  const [queryState, setQueryState] = useState({
    selectedAuthor: null,
    selectedCategory: null,
    selectedRating: null,
    sortOption: null,
    pagingOption: null,
    currentPage: null,
    maxPage: null,
    maxItems: null,
  });

  const FetchBooks = async () => {
    const {
      selectedAuthor,
      selectedCategory,
      selectedRating,
      sortOption,
      pagingOption,
      currentPage,
    } = queryState;
    const bookList = await fetchBooksByQuery(
      selectedAuthor,
      selectedCategory,
      selectedRating,
      sortOption[0],
      pagingOption[0],
      currentPage
    );
    if (bookList.data) {
      const data = bookList.data;
      setQueryState((prev) => ({
        ...prev,
        maxPage: data.max_page,
        maxItems: data.max_items,
      }));
      return data.items;
    }
    throw bookList.error;
  };

  const {
    data: books,
    isLoading,
    status,
  } = useQuery({
    queryKey: [
      "book-list",
      {
        selectedAuthor: queryState.selectedAuthor,
        selectedCategory: queryState.selectedCategory,
        selectedRating: queryState.selectedRating,
        sortOption: queryState.sortOption,
        pagingOption: queryState.pagingOption,
        currentPage: queryState.currentPage,
      },
    ],
    queryFn: () => FetchBooks(),
    enabled: optionsStatus == "success",
    retry: 3,
    retryDelay: 2000,
    refetchOnMount: "always",
    staleTime: 5 * 60 * 1000,
  });
  const booksStatus = optionsStatus == "error" ? "error" : status;
  const booksIsLoading = optionsStatus == "pending" || booksStatus == "pending";
  useEffect(() => {
    const defaultSortOption = bookSortOptions?.find(
      (opt) => opt[0] == "on-sale"
    );
    if (queryState.sortOption == null && defaultSortOption != null) {
      setQueryState((prev) => ({
        ...prev,
        sortOption: defaultSortOption,
      }));
    }
  }, [bookSortOptions]);
  useEffect(() => {
    const defaultPaging = pagingOptions?.find((opt) => opt[0] == "20");
    if (queryState.pagingOption == null && defaultPaging != null) {
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
    queryState.selectedAuthor,
    queryState.selectedCategory,
    queryState.selectedRating,
    queryState.sortOption,
    queryState.pagingOption,
  ]);

  return (
    <BookQueryContext.Provider
      value={{
        ...queryState,
        books,
        booksIsLoading,
        booksStatus,
        setQueryState,
      }}
    >
      {children}
    </BookQueryContext.Provider>
  );
};

export const useBookQuery = () => {
  return useContext(BookQueryContext);
};
