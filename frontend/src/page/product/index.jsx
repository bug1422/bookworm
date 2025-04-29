import { Link, useParams } from "react-router-dom";
import BookDetailSection from "./bookDetailSection";
import ReviewSection from "./reviewSection";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import { SearchProvider } from "@/components/context/useSearch";
import { fetchBookDetail } from "@/api/get/book";
import { ReviewQueryProvider } from "@/components/context/useReviewQueryContext";
import SpinningCircle from "@/components/icons/loading";

const ProductError = ({ text }) => {
  return (
    <div className="top-1/2 left-1/2 fixed -translate-x-1/2 text-5xl font-bold flex flex-col items-center gap-4">
      <div>{text}</div>
      <Link
        className="font-light text-base text-white bg-black p-3 rounded-md hover:text-black hover:bg-gray-200 trasition duration-100"
        to="/shop"
      >
        Go back to Shop
      </Link>
    </div>
  );
};

const ProductLoading = ({ text }) => {
  return (
    <div className="top-1/2 left-1/2 fixed -translate-x-1/2 text-5xl font-bold flex flex-col items-center gap-4">
      <SpinningCircle />
    </div>
  );
};
const ProductPage = () => {
  const { productId } = useParams();
  if (productId == undefined) return;
  <ProductError text="Product not found" />;
  const {
    data: book,
    isLoading,
    status,
  } = useQuery({
    queryKey: [`product-${productId}`],
    retryOnMount: true,
    retry: 3,
    retryDelay: 2000,
    queryFn: () => FetchBookDetail(),
    enabled: productId !== null,
    staleTime: 0,
  });

  const FetchBookDetail = async () => {
    const response = await fetchBookDetail(productId);
    if (response.data) {
      return response.data;
    }
    throw response.error;
  };
  return (
    <SearchProvider>
      {isLoading ? (
        <ProductLoading />
      ) : status == "error" ? (
        <ProductError text="Product is down at the moment" />
      ) : (
        <div className="my-6">
          <div className="py-8 mb-12 border-b-2 border-gray-200 xl:text-2xl font-bold">
            {isLoading ? (
              <SkeletonLoader width={"25"} />
            ) : (
              <>{book.category_name}</>
            )}
          </div>
          <BookDetailSection book={book} bookIsLoading={isLoading} />
          <ReviewQueryProvider>
            <ReviewSection book={book} bookIsLoading={isLoading} />
          </ReviewQueryProvider>
        </div>
      )}
    </SearchProvider>
  );
};

export default ProductPage;
