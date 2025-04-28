import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBookQuery } from "@/components/context/useBooksQueryContext";
import { useEffect } from "react";
import BookCard from "@/components/card/book";
import { useSearch } from "@/components/context/useSearch";
import { cn } from "@/lib/utils";
import OptionDropdown from "@/components/dropdown/option";

//mock api option
const SortDropdown = () => {
  const { bookSortOptions } = useSearch();
  const { sortOption, setQueryState } = useBookQuery();
  var sortIsUnavail =
    bookSortOptions === undefined || bookSortOptions.length == 0;
  return (
    <OptionDropdown
      onSelect={(opt) => {
        console.log(opt)
        if (opt[0] !== sortOption[0]) {
          setQueryState((prev) => ({
            ...prev,
            sortOption: opt,
          }));
        }
      }}
      options={bookSortOptions}
      selectedOption={sortOption}
      disabled={sortIsUnavail}
    />
  );
};

const ShowDropdown = () => {
  const { pagingOptions } = useSearch();
  const { pagingOption, setQueryState } = useBookQuery();
  var pagingIsUnavail =
    pagingOptions === undefined || pagingOptions.length == 0;
  return (
    <OptionDropdown
      onSelect={(opt) => {
        if (opt[0] !== pagingOption[0]) {
          setQueryState((prev) => ({
            ...prev,
            pagingOption: opt,
          }));
        }
      }}
      options={pagingOptions}
      selectedOption={pagingOption}
      disabled={pagingIsUnavail}
    />
  );
};

const ListPagination = ({ className }) => {
  const { currentPage, maxPage, setQueryState } = useBookQuery();
  useEffect(() => {
    setCurrentPage(1);
  }, []);
  const setCurrentPage = (page) => {
    setQueryState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };
  return (
    <Pagination className={cn("h-24", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="select-none cursor-pointer"
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="select-none cursor-pointer"
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            {currentPage > 1 && currentPage - 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="select-none cursor-pointer" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="select-none cursor-pointer"
            onClick={() => {
              if (currentPage < maxPage) setCurrentPage(currentPage + 1);
            }}
          >
            {currentPage < maxPage && currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="select-none cursor-pointer"
            onClick={() => {
              if (currentPage < maxPage) setCurrentPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const LoadingGrid = ({ itemCount = 4 }) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {Array(itemCount)
        .fill(1)
        .map((v, k) => (
          <BookCard key={k} />
        ))}
    </div>
  );
};

const ErrorGrid = () => {
  return (
    <div className="flex flex-col text-4xl absolute top-1/3 -translate-x-1/2 left-1/2">
      Server is down at the moment
    </div>
  );
};

const NoBookGrid = () => {
  return (
    <div className="flex flex-col text-4xl absolute top-1/3 -translate-x-1/2 left-1/2">
      No book found
      <span className="text-[20px] font-light text-center">
        Try different option
      </span>
    </div>
  );
};

const ListSection = () => {
  const { books, booksIsLoading, booksStatus, maxPage, maxItems, currentPage } =
    useBookQuery();
  return (
    <div>
      <div className="mb-4 flex justify-between">
        {!booksIsLoading && booksStatus == "success" && (
          <div>{`Showing ${currentPage}-${maxPage} of ${maxItems} books`}</div>
        )}
        <div className="flex gap-4 ml-auto">
          <SortDropdown />
          <ShowDropdown />
        </div>
      </div>
      <div className=" min-h-[700px] relative flex flex-col pb-24">
        {booksIsLoading ? (
          <LoadingGrid />
        ) : booksStatus == "error" ? (
          <ErrorGrid />
        ) : books == undefined || books.length == 0 ? (
          <NoBookGrid />
        ) : (
          <>
            <div className="grid grid-cols-4 gap-6">
              {books.map((v, k) => (
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
            </div>
          </>
        )}
        <ListPagination className="absolute bottom-0 -translate-x-1/2 left-1/2" />
      </div>
    </div>
  );
};

export default ListSection;
