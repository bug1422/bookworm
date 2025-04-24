import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../fallback/skeletonLoader";

const BookCard = ({
  bookId = undefined,
  bookTitle = undefined,
  authorName = undefined,
  img_path = undefined,
  bookPrice = undefined,
  finalPrice = undefined,
}) => {
  const isUndefined = bookId === undefined;
  const navigate = useNavigate();
  return (
    <Card
      className="select-none cursor-pointer w-64 h-fit gap-0 p-0"
      onClick={() => {
        navigate("/product/" + bookId);
      }}
    >
      <CardHeader className="w-full h-fit border-b-2 rounded-sm border-gray-100 ">
        <img
          src={"/assets/book-placeholder.png"}
          alt="book-image"
          className="object-center w-full h-64"
        />
      </CardHeader>
      <CardContent className="border-b-2 animate-pulse h-24 px-5 pt-3">
        <div className="flex flex-col gap-3">
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
          <p className="text-gray-400 line-through">{bookPrice}</p>
        )}
        {!isUndefined && <p className="ms-2 font-bold">{finalPrice}</p>}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
