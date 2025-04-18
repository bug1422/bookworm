import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BookCard from "../../component/card/book";
import { useEffect, useState } from "react";
import {
  fetchOnSaleBook,
  fetchOnSaleBook as getOnSaleBooks,
} from "@/api/service/book";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const ItemContainer = ({ books }) => {
  return (
    <CarouselItem className="">
      <div className="px-44 grid grid-cols-4 xl:gap-8">
        {books &&
          books.map((v, k) => (
            <BookCard
              bookId={v.id}
              key={k}
              bookTitle={v.book_title}
              authorName={v.author_name}
              bookPrice={v.book_price}
              finalPrice={v.final_price}
            />
          ))}
      </div>
    </CarouselItem>
  );
};

const OnSaleSection = () => {
  const navigate = useNavigate()
  const itemPerContainer = 4;
  const [onSaleBookContainers, setOnSaleBookContainers] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const result = await fetchOnSaleBook();
      console.log(result);
      if (result) {
        let bookContainers = [];
        for (let i = 0; i < result.length; i += itemPerContainer) {
          bookContainers.push(result.slice(i, i + itemPerContainer));
        }
        setOnSaleBookContainers(bookContainers);
      }
    };
    getData()
  }, []);

  return (
    <div className="w-full xl:my-8">
      <div className="w-full xl:text-3xl py-2 flex items-center justify-between">
        <div>On Sale</div>
        <Button className="p-6 select-none cursor-pointer" onClick={() => { navigate("/shop")}}>
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </div>
      <Carousel className={"min-h- border-1 border-gray-200 p-6"}>
        <CarouselContent className={"min-h-[25rem]"}>
          {onSaleBookContainers.map((books, k) => (
            <ItemContainer key={k} books={books} />
          ))}
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
