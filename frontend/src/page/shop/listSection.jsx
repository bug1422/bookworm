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
import { useBookQuery } from "../../component/context/useBookQueryContext";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import BookCard from "@/component/card/book";
import { useSearch } from "@/component/context/useSearch";

//mock api option
const SortDropdown = () => {
  const [open, setOpen] = useState(false);
  const { bookSortOptions } = useSearch();
  const { sortOption, setQueryState } = useBookQuery();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant="secondary"
          className="w-fit justify-between"
        >
          {sortOption ? sortOption[1] : "In case no value"}
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
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant="secondary"
          className="w-fit justify-between"
        >
          {pagingOption ? pagingOption[1] : "In case no value"}
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

const ListPagination = () => {
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
    <Pagination className="h-24">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            {currentPage > 1 && currentPage - 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => {
              if (currentPage < maxPage) setCurrentPage(currentPage + 1);
            }}
          >
            {currentPage < maxPage && currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < maxPage) setCurrentPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const ListSection = () => {
  const { shows } = useBookQuery();
  const { books, setQueryState } = useBookQuery();

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>Showing 1-12 of 126 books</div>
        <div className="flex gap-4">
          <SortDropdown />
          <ShowDropdown />
        </div>
      </div>
      <div className=" min-h-[700px]">
        {books.length > 0 && (
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
                />
              ))}
            </div>
            <ListPagination />
          </>
        )}
      </div>
    </div>
  );
};

export default ListSection;
