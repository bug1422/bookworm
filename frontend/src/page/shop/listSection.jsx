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
import { useQuery } from "./usequeryContext";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import BookCard from "@/component/card/book";

//mock api option
const sortOptions = [
  { value: "sale", label: "Sort by on sale" },
  { value: "popularity", label: "Sort by popularity" },
  { value: "price-asc", label: "Sort by price: low to high" },
  { value: "price-desc", label: "Sort by price: high to low" },
];

const SortDropdown = () => {
  const [open, setOpen] = useState(false);
  const { sorts, setSorts } = useQuery();
  useEffect(() => {
    setSorts(sortOptions[0].value);
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant="secondary"
          className="w-fit justify-between"
        >
          {sorts
            ? sortOptions.find((opt) => opt.value === sorts)?.label
            : "In case no value"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup>
              {sortOptions.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(curValue) => {
                    if (curValue !== sorts) {
                      setSorts(curValue);
                    }
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const showsOptions = [
  { value: "5", label: "Show 5" },
  { value: "15", label: "Show 15" },
  { value: "20", label: "Show 20" },
  { value: "25", label: "Show 25" },
];

const ShowDropdown = () => {
  const [open, setOpen] = useState(false);
  const { shows, setShows } = useQuery();
  useEffect(() => {
    setShows(showsOptions[2].value);
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant="secondary"
          className="w-fit justify-between"
        >
          {shows
            ? showsOptions.find((opt) => opt.value == shows)?.label
            : "In case no value"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup>
              {showsOptions.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(curValue, v) => {
                    if (curValue !== shows) {
                      setShows(parseInt(curValue));
                    }
                    setOpen(false);
                  }}
                >
                  {opt.label}
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
  const { currentPage, setCurrentPage, maxPage } = useQuery();
  useEffect(() => {
    setCurrentPage(1);
  }, []);
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
  const { shows } = useQuery();

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>Showing 1-12 of 126 books</div>
        <div className="flex gap-4">
          <SortDropdown />
          <ShowDropdown />
        </div>
      </div>
      <div className="grid grid-cols-4 min-h-[700px]">
        {Array(shows)
          .fill(1)
          .map((v, k) => (
            <BookCard key={k} />
          ))}
      </div>
      <ListPagination />
    </div>
  );
};

export default ListSection;
