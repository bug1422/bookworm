import SkeletonLoader from "@/components/fallback/skeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const BookDetailSection = ({ id = undefined }) => {
  const { data: book, isLoading } = useQuery({
    queryKey: [`product-${id}`],
    queryFn: () => fetchBookDetail(),
  });

  const fetchBookDetail = async () => {
    if (id) {
      return;
    } else {
      return undefined;
    }
  };
  var bookIsUnavail = isLoading || book === undefined;
  return (
    <>
      <div className="py-8 mb-12 border-b-2 border-gray-200 xl:text-2xl font-bold">
        {bookIsUnavail ? (
          <SkeletonLoader width={"25"}/>
        ) : (
          <>{book.category_name}</>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 border-1 border-gray-200 rounded-md flex gap-16">
          <div>
            <img
              src={"/assets/book-placeholder.png"}
              alt="book-image"
              className="object-center w-full h-64 bg-gray-100 rounded-s-md"
            />
            {bookIsUnavail ? (
              <SkeletonLoader width={"24"} className="ms-auto mt-2"/>
            ) : (
              <div className="text-right text-gray-400">
                By (author){" "}
                <span className="font-bold">{book.author_name}</span>{" "}
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-6 w-full">
            {bookIsUnavail ? <SkeletonLoader height={"6"} width={"25"}/>:<div className="text-xl font-bold">{book.book_title}</div>}
            {bookIsUnavail ? <>
                <SkeletonLoader width={"1/2"}/>
                <SkeletonLoader width={"1/2"}/>
                <SkeletonLoader width={"1/2"}/>
                <SkeletonLoader width={"1/2"}/>
                <SkeletonLoader width={"1/2"}/>
            </>:<div className="text-xl font-bold">{book.book_summary}</div>}
          </div>
        </div>
        <div className=" col-span-2 border-1 border-gray-200 rounded-md">
                
        </div>

      </div>
    </>
  );
};

export default BookDetailSection;
