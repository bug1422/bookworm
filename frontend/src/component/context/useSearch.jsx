import { fetchSearchOption } from "@/api/service/searchOption";
import { createContext, useState, useEffect, useContext } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [options, setOptions] = useState({
    authorNames: [],
    categoryNames: [],
    ratingList: [],
    pagingOptions: [],
    bookSortOptions: [],
    reviewSortOptions: [],
  });
  useEffect(() => {
    const getData = async () => {
      const result = await fetchSearchOption();
      if (result) {
        setOptions((prev) => ({
          authorNames: result.author_names,
          categoryNames: result.category_names,
          ratingList: result.rating_list,
          pagingOptions: result.paging_options ? Object.entries(result.paging_options) : [],
          bookSortOptions: result.book_sort_options ?  Object.entries(result.book_sort_options) : [],
          reviewSortOptions: result.review_sort_options ?  Object.entries(result.review_sort_options) : [],
        }));
      }
    };
    getData();
  }, []);

  return (
    <SearchContext.Provider
      value={{
        ...options,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
