import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BookCard from "../../component/card/book";
const ItemContainer = ({ books }) => {
  return (
    <CarouselItem className="">
      <div className="flex justify-center gap-8 md:basis-1/2 lg:basis-1/4">
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
      </div>
    </CarouselItem>
  );
};

const OnSaleSection = () => {
  return (
    <div className="w-full xl:my-8">
      <div className="xl:text-3xl">On Sale</div>
      <Carousel
        className={"border-1 border-gray-200 p-6"}
      >
          <CarouselContent >
            <ItemContainer />
            <ItemContainer />
            <ItemContainer />
            <ItemContainer />
          </CarouselContent>
        <div className="absolute scale-125 top-1/2 left-2 flex items-center justify-center">
          <CarouselPrevious className="relative left-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
        </div>
        <div className="absolute scale-125 top-1/2 right-2 flex items-center justify-center">
          <CarouselNext className="relative right-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
        </div>
      </Carousel>
    </div>
  );
};

export default OnSaleSection;
