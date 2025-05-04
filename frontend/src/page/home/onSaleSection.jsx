import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { fetchOnSaleBook, fetchOnSaleBook as getOnSaleBooks } from "@/api/book";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BookCard from "@/components/card/book";
const ItemContainer = ({ books }) => {
  return (
    <CarouselItem className="">
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-44 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
        {books &&
          books.map((v, k) => (
            <BookCard
              bookId={v.id}
              key={k}
              bookTitle={v.book_title}
              authorName={v.author_name}
              bookPrice={v.book_price}
              finalPrice={v.final_price}
              img_path={v.book_cover_photo}
              isOnSale={v.is_on_sale}
            />
          ))}
      </div>
    </CarouselItem>
  );
};
const FallbackContainer = ({ itemCount }) => {
  return (
    <CarouselItem>
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-44 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
        {Array(itemCount)
          .fill(1)
          .map((v, k) => (
            <BookCard key={k} />
          ))}
      </div>
    </CarouselItem>
  );
};

const NoBookContainer = () => {
  return (
    <CarouselItem>
      <div className="h-96 flex px-44 xl:gap-8 font-bold text-6xl justify-center items-center">
        Nothing On Sale At The Moment
      </div>
    </CarouselItem>
  );
};

const OnSaleSection = () => {
  const navigate = useNavigate();
  const [itemPerContainer, setItemPerContainer] = useState(getCount());
  function getCount() {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 1279) return 2;
    return 4;
  }

  const { data: saleBooks, isLoading } = useQuery({
    queryKey: ["on-sale"],
    queryFn: () => fetchOnSaleContainer(),
    retryOnMount: true,
    retry: 3,
    retryDelay: 2000,
  });
  const [onSaleBookContainers, setOnSaleBookContainers] = useState([]);
  const fetchOnSaleContainer = async () => {
    const result = await fetchOnSaleBook();
    if (result.data) {
      return result.data;
    }
    throw result.error;
  };

  useEffect(() => {
    const update = () => setItemPerContainer(getCount());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let bookContainers = [];
    if (saleBooks != undefined) {
      for (let i = 0; i < saleBooks.length; i += itemPerContainer) {
        bookContainers.push(saleBooks.slice(i, i + itemPerContainer));
      }
    }
    setOnSaleBookContainers(bookContainers);
  }, [saleBooks, itemPerContainer]);

  return (
    <div className="w-full xl:my-8">
      <div className="w-full xl:text-3xl py-2 flex items-center justify-between">
        <div>On Sale</div>
        <Button
          className="p-6 select-none cursor-pointer"
          onClick={() => {
            navigate("/shop");
          }}
        >
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </div>
      <Carousel className={"min-h-[25rem] border-1 border-gray-200 p-6"}>
        <CarouselContent className="h-full">
          {isLoading ? (
            <FallbackContainer itemCount={itemPerContainer} />
          ) : onSaleBookContainers === undefined ||
            onSaleBookContainers.length == 0 ? (
            <NoBookContainer />
          ) : (
            <>
              {onSaleBookContainers.map((books, k) => (
                <ItemContainer key={k} books={books} />
              ))}
            </>
          )}
        </CarouselContent>
        <div className="absolute scale-200 top-1/2 left-5 flex items-center justify-center">
          <CarouselPrevious className="relative left-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
        </div>
        <div className="absolute scale-200 top-1/2 right-5 flex items-center justify-center">
          <CarouselNext className="relative right-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
        </div>
      </Carousel>
    </div>
  );
};

export default OnSaleSection;
