import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BookCard = () => {
  return (
    <Card className="min-w-60 w-full h-fit gap-0 p-0">
      <CardHeader className="w-full h-fit border-b-2 rounded-sm border-gray-100 ">
        <img
          src="/assets/book-placeholder.png"
          alt="book-image"
          className="object-center w-full min-h-56"
        />
      </CardHeader>
      <CardContent className="border-b-2 pb-5 px-5 pt-3">
        <div>
          <p className="text-xl font-bold">Book Title</p>
          <p className="font-light">Author Name</p>
        </div>
      </CardContent>
      <CardFooter className="py-3 bg-gray-100">
        <p className="text-gray-400 line-through">$50</p><p className="ms-2 font-bold">$20</p>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
