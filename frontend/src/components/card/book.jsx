import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../fallback/skeletonLoader";
import { useOptions } from "../context/useOptionsContext";
import { useEffect } from "react";

const BookCard = ({
  bookId = undefined,
  bookTitle = undefined,
  authorName = undefined,
  img_path = undefined,
  bookPrice = undefined,
  finalPrice = undefined,
  isOnSale = false,
}) => {
  const isUndefined = bookId === undefined;
  const navigate = useNavigate();
  const { getCurrency } = useOptions();
  const navigating = () => navigate("/product/" + bookId);
  return (
    <Card
      className="select-none cursor-pointer w-full max-w-xs h-fit gap-0 p-0"
      onClick={() => {
        navigating();
      }}
    >
      <CardHeader className="w-full h-fit border-b-2 px-0 rounded-sm border-gray-100 ">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${img_path}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/book-placeholder.png";
          }}
          alt="book-image"
          className="object-fill w-full h-64"
        />
      </CardHeader>
      <CardContent className="border-b-2 h-24 px-5 pt-3">
        <div className="flex flex-col gap-1">
          {isUndefined ? (
            <SkeletonLoader height={"6"} width={"32"} />
          ) : (
            <p className="text-xl font-bold line-clamp-2">{bookTitle}</p>
          )}
          {isUndefined ? (
            <SkeletonLoader width={"20"} />
          ) : (
            <p className="font-light truncate">{authorName}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="h-8 py-3 bg-gray-100">
        {isUndefined ? (
          <SkeletonLoader width={"1/4"} height={"2"} />
        ) : (
          <>
            {isOnSale && (
              <p className="text-gray-400 line-through">
                {getCurrency(bookPrice)}
              </p>
            )}
            <p className="ms-2 font-bold">{getCurrency(finalPrice)}</p>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
