import { fetchPopularBook, fetchRecommendedBook } from "@/api/book";
import BookCard from "@/components/card/book";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const FallbackGrid = ({ itemCount }) => {
  return (
    <>
      {Array(itemCount)
        .fill(1)
        .map((v, k) => (
          <BookCard key={k} />
        ))}
    </>
  );
};

const NoBookGrid = ({ text }) => {
  return (
    <div className="col-span-4 row-span-2 font-bold text-6xl self-center justify-self-center">
      {text}
    </div>
  );
};

const FeaturedGrid = ({ bookList }) => {
  return (
    <>
      {bookList.map((v, k) => (
        <BookCard
          bookId={v.id}
          key={k}
          bookTitle={v.book_title}
          authorName={v.author_name}
          bookPrice={v.book_price}
          finalPrice={v.final_price}
          img_path={v.book_cover_photo}
        />
      ))}
    </>
  );
};

const FeaturedBookSection = () => {
  const [mode, setMode] = useState(-1);
  const { data: recommendedList, isLoading: recommendedIsLoading } = useQuery({
    queryKey: ["recommended"],
    queryFn: () => fetchRecommendedList(),
    enabled: mode == 0,
    retryOnMount: true,
    retry: 3,
    retryDelay: 2000,
  });
  const { data: popularList, isLoading: popularIsLoading } = useQuery({
    queryKey: ["popular"],
    queryFn: () => fetchPopularList(),
    enabled: mode == 1,
    retryOnMount: true,
    retry: 3,
    retryDelay: 2000,
  });

  useEffect(() => {
    setMode(0);
  }, []);
  const fetchRecommendedList = async () => {
    const result = await fetchRecommendedBook();
    if (result.data) {
      return result.data
    }
    throw result.error;
  };
  const fetchPopularList = async () => {
    const result = await fetchPopularBook();
    if (result.data) {
      return result.data
    }
    throw result.error;
  };
  return (
    <div className="flex flex-col gap-4 items-center w-full xl:my-16">
      <div className="xl:text-3xl">Featured Books</div>
      <div className="grid grid-cols-2">
        <Button
          className="cursor-pointer"
          variant={mode == 0 ? "secondary" : "primary"}
          onClick={() => {
            setMode(0);
          }}
        >
          Recommended
        </Button>
        <Button
          className="cursor-pointer"
          variant={mode == 1 ? "secondary" : "primary"}
          onClick={() => {
            setMode(1);
          }}
        >
          Popular
        </Button>
      </div>
      <div className="border-1 border-gray-200 p-6 px-50 w-full min-h-[52rem] xl:gap-8 grid grid-cols-4">
        {mode == 0 && (
          <>
            {recommendedIsLoading ? (
              <FallbackGrid itemCount={8} />
            ) : recommendedList === undefined || recommendedList.length == 0 ? (
              <NoBookGrid text="Nothing Is Recommended At The Moment" />
            ) : (
              <FeaturedGrid bookList={recommendedList} />
            )}
          </>
        )}
        {mode == 1 && (
          <>
            {popularIsLoading ? (
              <FallbackGrid itemCount={8} />
            ) : popularList === undefined || popularList.length == 0 ? (
              <NoBookGrid text="Nothing Is Popular At The Moment" />
            ) : (
              <FeaturedGrid bookList={popularList} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedBookSection;
