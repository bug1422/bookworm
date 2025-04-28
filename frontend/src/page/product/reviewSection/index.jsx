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
      <div className="grid grid-cols-7 gap-4 mt-6">
        <div className="col-span-5 rounded-md bg-gray-200 p-4">
          <ReviewFilter book={book} bookIsLoading={bookIsLoading} />
          <ReviewList />
        </div>
        <div className="col-span-2 flex flex-col divide-x-2">
          <AddReviewForm />
        </div>
      </div>
  );
};

export default ReviewSection;
