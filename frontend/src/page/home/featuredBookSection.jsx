import { fetchPopularBook, fetchRecommendedBook } from "@/api/get/book";
import BookCard from "@/component/card/book";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const FeaturedBookSection = () => {
  const [mode, setMode] = useState(-1);
  const [featuredList, setFeaturedList] = useState([]);
  useEffect(() => {
    if (mode == 0) getRecommendedList();
    else if (mode == 1) getPopularList();
  }, [mode]);
  useEffect(() => {
    setMode(0);
  }, []);
  const getRecommendedList = async () => {
    const result = await fetchRecommendedBook();
    if (result) {
      setFeaturedList(result);
    }
  };
  const getPopularList = async () => {
    const result = await fetchPopularBook();
    if (result) {
      setFeaturedList(result);
    }
  };
  return (
    <div className="flex flex-col gap-4 items-center w-full xl:my-16">
      <div className="xl:text-3xl">Featured Books</div>
      <div className="grid grid-cols-2">
        <Button
          variant={mode == 0 ? "secondary" : "primary"}
          onClick={() => {
            setMode(0);
          }}
        >
          Recommended
        </Button>
        <Button
          variant={mode == 1 ? "secondary" : "primary"}
          onClick={() => {
            setMode(1);
          }}
        >
          Popular
        </Button>
      </div>
      <div className="border-1 border-gray-200 p-6 px-50 w-full min-h-[52rem] xl:gap-8 grid grid-cols-4">
        {featuredList.map((v, k) => (
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
    </div>
  );
};

export default FeaturedBookSection;
