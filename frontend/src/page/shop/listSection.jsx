import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBookQuery } from "@/components/context/useBookQueryContext";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import BookCard from "@/components/card/book";
import { useSearch } from "@/components/context/useSearch";
import { cn } from "@/lib/utils";

//mock api option
const SortDropdown = () => {
  const [open, setOpen] = useState(false);
  const { bookSortOptions } = useSearch();
  const { sortOption, setQueryState } = useBookQuery();
  var sortIsUnavail =
    bookSortOptions === undefined || bookSortOptions.length == 0;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={sortIsUnavail} asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant="secondary"
          className="w-36 justify-between"
        >
          {sortOption ? sortOption[1] : ""}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup>
              {bookSortOptions.map((opt) => (
                <CommandItem
                  key={opt[0]}
                  value={opt[0]}
                  onSelect={(curValue, v) => {
                    if (curValue !== sortOption[0]) {
                      setQueryState((prev) => ({
                        ...prev,
                        sortOption: opt,
                      }));
                    }
                    setOpen(false);
                  }}
                >
                  {opt[1]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const ShowDropdown = () => {
  const [open, setOpen] = useState(false);
  const { pagingOptions } = useSearch();
  const { pagingOption, setQueryState } = useBookQuery();
  var pagingIsUnavail =
    pagingOptions === undefined || pagingOptions.length == 0;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={pagingIsUnavail} asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant="secondary"
          className="w-30 justify-between"
        >
          {pagingOption ? pagingOption[1] : ""}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup>
              {pagingOptions.map((opt) => (
                <CommandItem
                  key={opt[0]}
                  value={opt[0]}
                  onSelect={(curValue, v) => {
                    if (curValue !== pagingOption[0]) {
                      setQueryState((prev) => ({
                        ...prev,
                        pagingOption: opt,
                      }));
                    }
                    setOpen(false);
                  }}
                >
                  {opt[1]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const ListPagination = ({ cls }) => {
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
    <Pagination className={cn("h-24", cls)}>
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

const LoadingGrid = ({ itemCount }) => {
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

const NoBookGrid = () => {
  return <div className="flex flex-col text-4xl absolute top-1/3 -translate-x-1/2 left-1/2">
    No book found
    <span className="text-[20px] font-light text-center">Try different option</span>
    </div>;
};

const ListSection = () => {
  const { shows } = useBookQuery();
  const { books, bookIsLoading, setQueryState } = useBookQuery();
  const booksIsUnavail = books === undefined || books.length == 0 
  return (
    <div>
      <div className="mb-4 flex justify-between">
        { !booksIsUnavail && <div>Showing 1-12 of 126 books</div>}
        <div className="flex gap-4 ml-auto">
          <SortDropdown />
          <ShowDropdown />
        </div>
      </div>
      <div className=" min-h-[700px] relative">
        {bookIsLoading ? (
          <LoadingGrid />
        ) : booksIsUnavail ? (
          <NoBookGrid />
        ) : (
          <>
            <div className="grid grid-cols-4 gap-6">
              {books !== undefined && (
                <>
                  {books.map((v, k) => (
                    <BookCard
                      bookId={v.id}
                      key={k}
                      bookTitle={v.book_title}
                      authorName={v.author_name}
                      bookPrice={v.book_price}
                      finalPrice={v.final_price}
                    />
                  ))}
                </>
              )}
            </div>
          </>
        )}
        <ListPagination cls="absolute bottom-0" />
      </div>
    </div>
  );
};

export default ListSection;
