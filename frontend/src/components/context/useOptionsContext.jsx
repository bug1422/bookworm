import { fetchMoneyOption, fetchSearchOption } from '@/api/option';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

const OptionsContext = createContext();

export const OptionsProvider = ({ children }) => {
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
    if (result.error) {
      throw Error(result.errorMessage);
    }
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

  const FetchMoneyOptions = async () => {
    const result = await fetchMoneyOption();
    let options = {
      currencies: {},
    };
    if (result.error) {
      throw Error(result.errorMessage);
    }
    if (result.data) {
      if (result.data.currencies) options.currencies = result.data.currencies;
    }
    return options;
  };

  const {
    data: searchOptions,
    isLoading: isOptionLoading,
    status: optionsStatus,
  } = useQuery({
    queryKey: ['search-option'],
    retry: () => true,
    retryDelay: 5000,
    queryFn: () => FetchSearchOptions(),
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: true,
    staleTime: 30 * 60 * 1000,
  });

  const {
    data: moneyOptions,
    isLoading,
    status: moneyOptionsStatus,
  } = useQuery({
    queryKey: ['money-option'],
    retry: () => true,
    retryDelay: 5000,
    queryFn: () => FetchMoneyOptions(),
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: true,
    staleTime: 30 * 60 * 1000,
  });
  const selectedCurrencyMode = import.meta.env.VITE_CURRENCY_MODE;
  const currencyMode = {
    USD: 'en-US',
    VND: 'vi-VN',
  };

  const getCurrency = (value) => {
    console.log(moneyOptions?.currencies);
    if (Object.keys(moneyOptions?.currencies || {}).length === 0)
      return 'loading...';
    const currentCurrency = moneyOptions?.currencies[selectedCurrencyMode];
    if (currentCurrency === undefined) return 'error...';
    return (value * currentCurrency.exchange_rate).toLocaleString(
      currencyMode[selectedCurrencyMode] ?? 'en-US',
      {
        style: 'currency',
        currency: selectedCurrencyMode,
      },
    );
  };

  useEffect(() => {});
  return (
    <OptionsContext.Provider
      value={{
        ...searchOptions,
        getCurrency,
        isOptionLoading,
        optionsStatus,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  return useContext(OptionsContext);
};
