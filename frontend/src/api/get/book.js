import { api } from "..";

export const fetchOnSaleBook = async () => {
  try {
    const response = await api.get("/books/on-sale");
    return {
      data: response.data?.detail,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};
export const fetchRecommendedBook = async () => {
  try {
    const response = await api.get("/books/featured/recommended");
    return {
      data: response.data?.detail,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const fetchPopularBook = async () => {
  try {
    const response = await api.get("/books/featured/popular");
    return {
      data: response.data?.detail,
    };
  } catch (error) {
    return {
      error: error,
    };
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
    return {
      data: response.data?.detail,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export  const fetchBookDetail= async(bookId) => {
  try {
    if (bookId === undefined|| bookId === null) throw Error("book id doesn't exist")
    const response = await api.get(`/books/${bookId}`);
    return {
      data: response.data?.detail,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}
export const fetchBookReviewsByQuery = async (
  bookId,
  ratingStar,
  sortOption,
  pagingOption,
  currentPage
) => {
  try {
    const response = await api.get(`/books/${bookId}/reviews`, {
      params: {
        page: currentPage,
        take: pagingOption,
        sort_option: sortOption,
        rating_star: ratingStar,
      },
    });
    return {
      data: response.data?.detail,
    };
  } catch (error) {
    console.log(error);
    return {
      error: error,
    };
  }
};

export const addBookReview = async (bookId, title, details, ratingStar) => {
  try {
    const response = await api.post(`/books/${bookId}/reviews`, {
      bookId,
      title,
      details,
      ratingStar,
    });
    return {
      data: response.data?.detail,
    };
  } catch (error) {
    console.log(error);
    return {
      error: error,
    };
  }
};
