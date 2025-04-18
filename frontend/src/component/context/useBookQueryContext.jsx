import { createContext, useState, useEffect, useContext } from "react";
import { useSearch } from "./useSearch";
import { fetchBooks } from "@/api/service/book";
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
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const defaultSortOption = bookSortOptions?.find(
      (opt) => opt[0] == "on-sale"
    );
    setQueryState((prev) => ({
      ...prev,
      sortOption: defaultSortOption,
    }));
  }, [bookSortOptions]);

  useEffect(() => {
    const defaultPaging = pagingOptions?.find((opt) => opt[0] == "20");
    setQueryState((prev) => ({
      ...prev,
      pagingOption: defaultPaging,
    }));
  }, [pagingOptions]);

  useEffect(() => {
    if (queryState.sortOption && queryState.pagingOption) {
      getBooks(1);
    }
  }, [
    queryState.selectedAuthor,
    queryState.selectedCategory,
    queryState.selectedRating,
    queryState.sortOption,
    queryState.pagingOption,
  ]);

  useEffect(() => {
    if (queryState.sortOption && pagingOption) {
      getBooks(queryState.currentPage);
    }
  }, [queryState.currentPage]);

  const getBooks = async (currentPage) => {
    console.log("call api")
    const {
      selectedAuthor,
      selectedCategory,
      selectedRating,
      sortOption,
      pagingOption,
    } = queryState;
    const bookList = await fetchBooks(
      selectedAuthor,
      selectedCategory,
      selectedRating,
      sortOption[0],
      pagingOption[0],
      currentPage
    );
    if (bookList) {
      setBooks(bookList);
      setQueryState((prev) => ({
        ...prev,
        maxPage: bookList.max_page,
        currentPage: bookList.current_page,
      }));
    }
  };

  return (
    <BookQueryContext.Provider value={{ ...queryState, books, setQueryState }}>
      {children}
    </BookQueryContext.Provider>
  );
};

export const useBookQuery = () => {
  return useContext(BookQueryContext);
};
