import { fetchPopularBook, fetchRecommendedBook } from '@/api/book';
import BookCard from '@/components/card/book';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

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
          isOnSale={v.is_on_sale}
        />
      ))}
    </>
  );
};

const FeaturedBookSection = () => {
  const [mode, setMode] = useState(-1);
  const { data: recommendedList, isLoading: recommendedIsLoading } = useQuery({
    queryKey: ['recommended'],
    queryFn: () => fetchRecommendedList(),
    enabled: mode == 0,
    retryOnMount: true,
    retry: 3,
    retryDelay: 2000,
  });
  const { data: popularList, isLoading: popularIsLoading } = useQuery({
    queryKey: ['popular'],
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
      return result.data;
    }
    throw result.error;
  };
  const fetchPopularList = async () => {
    const result = await fetchPopularBook();
    if (result.data) {
      return result.data;
    }
    throw result.error;
  };
  return (
    <div className="flex flex-col gap-4 items-center w-full min-h-[30rem] my-4 xl:my-16">
      <div className="xl:text-3xl">Featured Books</div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          className={cn(
            'cursor-pointer hover:bg-indigo-500',
            mode == 0 ? 'bg-indigo-400' : 'bg-indigo-50 text-black',
          )}
          onClick={() => {
            setMode(0);
          }}
        >
          Recommended
        </Button>
        <Button
          className={cn(
            'cursor-pointer hover:bg-indigo-500',
            mode == 1 ? 'bg-indigo-400' : 'bg-indigo-50 text-black',
          )}
          onClick={() => {
            setMode(1);
          }}
        >
          Popular
        </Button>
      </div>
      <div className="border border-gray-200 w-full px-4 py-3 sm:px-8 md:px-16 lg:px-24 xl:px-44 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
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
