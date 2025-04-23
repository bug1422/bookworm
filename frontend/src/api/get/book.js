import { api } from "..";

export const fetchOnSaleBook = async () => {
  try {
    const response = await api.get("/books/on-sale");
    return response.data?.detail;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const fetchRecommendedBook = async () => {
  try {
    const response = await api.get("/books/featured/recommended");
    return response.data?.detail;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchPopularBook = async () => {
  try {
    const response = await api.get("/books/featured/popular");
    return response.data?.detail;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchBooksByQuery = async (
  authorName,
  categoryName,
  ratingStar,
  sortOption,
  pagingOption,
  currentPage
) => {
  try {
    const response = await api.get("/books", {
      params: {
        page: currentPage,
        take: pagingOption,
        sort_option: sortOption,
        category_name: categoryName,
        author_name: authorName,
        rating_star: ratingStar,
      },
    });
    return response.data?.detail;
  } catch (error) {
    console.log(error);
    return [];
  }
};
