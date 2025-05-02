import { fetchSearchOption } from "@/api/searchOption";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const FetchSearchOptions = async () => {
    const result = await fetchSearchOption();
    let options = {
      authorNames: [],
      categoryNames: [],
      ratingList: [],
      pagingOptions: [],
      bookSortOptions: [],
      reviewSortOptions: [],
    };
    if (result.data) {
      const data = result.data;
      if (data.author_names) options.authorNames = data.author_names;
      if (data.category_names) options.categoryNames = data.category_names;
      if (data.rating_list) options.ratingList = data.rating_list;
      if (data.paging_options)
        options.pagingOptions = Object.entries(data.paging_options);
      if (data.book_sort_options)
        options.bookSortOptions = Object.entries(data.book_sort_options);
      if (data.review_sort_options)
        options.reviewSortOptions = Object.entries(data.review_sort_options);
    }
    return options;
  };
  const {
    data: options,
    isLoading: isOptionLoading,
    status: optionsStatus,
  } = useQuery({
    queryKey: ["search-option"],
    retry: 3,
    retryDelay: 2000,
    queryFn: () => FetchSearchOptions(),
    refetchOnReconnect: "always",
    staleTime: 30 * 60 * 1000,
  });

  return (
    <SearchContext.Provider
      value={{
        ...options,
        isOptionLoading,
        optionsStatus,
      }}
    >
      {options?.author_names !== undefined &&
        options.author_names.map((v, k) => <div>{v}</div>)}
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
