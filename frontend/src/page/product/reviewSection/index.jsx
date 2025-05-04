import {
  ReviewQueryProvider,
  useReviewQuery,
} from "@/components/context/useReviewQueryContext";
import AddReviewForm from "./addSection";
import ReviewFilter from "./filterSection";
import ReviewList from "./listSection";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ReviewSection = ({ book = undefined, bookIsLoading = true }) => {
  const { productId } = useParams();
  const { setQueryState } = useReviewQuery();
  useEffect(() => {
    setQueryState((prev) => ({ ...prev, bookId: productId }));
  }, [productId]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mt-6">
      <div className="order-1 lg:order-2 lg:col-span-2 flex flex-col divide-x-0 lg:divide-x-2">
        <AddReviewForm />
      </div>
      <div className="order-2 lg:order-1 lg:col-span-5 rounded-md bg-indigo-100 p-4">
        <ReviewFilter book={book} bookIsLoading={bookIsLoading} />
        <ReviewList />
      </div>
    </div>
  );
};

export default ReviewSection;
