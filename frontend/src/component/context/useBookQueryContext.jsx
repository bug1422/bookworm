import { createContext, useState, useEffect, useContext } from "react";
import { useSearch } from "./useSearch";
import { fetchBooksByQuery } from "@/api/get/book";
import { useQuery } from "@tanstack/react-query";
const BookQueryContext = createContext();

export const QueryProvider = ({ children }) => {
  const { pagingOptions, bookSortOptions } = useSearch();
  const [queryState, setQueryState] = useState({
    selectedAuthor: null,
    selectedCategory: null,
    selectedRating: null,
    sortOption: null,
    pagingOption: null,
    currentPage: null,
    maxPage: null,
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
    if (bookList) {
      setQueryState((prev) => ({
        ...prev,
        maxPage: bookList.max_page,
      }));
      return bookList.items;
    }
    else{
      return []
    }
  };

  const { data: books, isLoading: booksIsLoading } = useQuery({
    queryKey: [
      "book-list",
      {
        selectedAuthor: queryState.selectedAuthor,
        selectedCategory: queryState.selectedCategory,
        selectedRating: queryState.selectedRating,
        sortOption: queryState.sortOption,
        pagingOption: queryState.pagingOption,
        currentPage: queryState.currentPage
      }
    ],
    queryFn: () => FetchBooks(),
    enabled: queryState.sortOption != null
  });

  useEffect(() => {
    const defaultSortOption = bookSortOptions?.find(
      (opt) => opt[0] == "on-sale"
    );
    if (defaultSortOption != null) {
      setQueryState((prev) => ({
        ...prev,
        sortOption: defaultSortOption,
      }));
    }
  }, [bookSortOptions]);
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
  useEffect(() => {
    const defaultPaging = pagingOptions?.find((opt) => opt[0] == "20");
    if (defaultPaging != null) {
      setQueryState((prev) => ({
        ...prev,
        pagingOption: defaultPaging,
      }));
    }
  }, [pagingOptions]);

  return (
    <BookQueryContext.Provider
      value={{ ...queryState, books, booksIsLoading, setQueryState }}
    >
      {children}
    </BookQueryContext.Provider>
  );
};

export const useBookQuery = () => {
  return useContext(BookQueryContext);
};
