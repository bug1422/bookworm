import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const BookCard = ({bookId, bookTitle, authorName, img_path, bookPrice, finalPrice}) => {
  const navigate = useNavigate()
  return (
    <Card className="select-none cursor-pointer w-64 h-fit gap-0 p-0" onClick={() => { navigate("/product/"+bookId)}}>
      <CardHeader className="w-full h-fit border-b-2 rounded-sm border-gray-100 ">
        <img
          src={"/assets/book-placeholder.png"}
          alt="book-image"
          className="object-center w-full h-64"
        />
      </CardHeader>
      <CardContent className="border-b-2 h-24 px-5 pt-3">
        <div>
          <p className="text-xl font-bold line-clamp-2">{bookTitle}</p>
          <p className="font-light truncate">{authorName}</p>
        </div>
      </CardContent>
      <CardFooter className="h-8 py-3 bg-gray-100">
        <p className="text-gray-400 line-through">{bookPrice}</p><p className="ms-2 font-bold">{finalPrice}</p>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
