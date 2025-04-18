import { useBookQuery } from "@/component/context/useBookQueryContext";
import { useSearch } from "@/component/context/useSearch";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

const FilterSection = () => {
  const { authorNames, categoryNames, ratingList } = useSearch();
  const { selectedAuthor, selectedCategory, selectedRating, setQueryState } =
    useBookQuery();
  const selectAuthor = (value) => {
    if (selectedAuthor != value)
      setQueryState((prev) => ({
        ...prev,
        selectedAuthor: value,
      }));
    else {
      setQueryState((prev) => ({
        ...prev,
        selectedAuthor: null,
      }));
    }
  };
  const selectCategory = (value) => {
    if (selectedCategory != value)
      setQueryState((prev) => ({
        ...prev,
        selectedCategory: value,
      }));
    else {
      setQueryState((prev) => ({
        ...prev,
        selectedCategory: null,
      }));
    }
  };
  const selectRating = (value) => {
    if (selectedRating != value)
      setQueryState((prev) => ({
        ...prev,
        selectedRating: value,
      }));
    else {
      setQueryState((prev) => ({
        ...prev,
        selectedRating: null,
      }));
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold text-2xl">Filter By</div>
      <Accordion
        className="xl:rounded-sm h-fit border-2 border-gray-200"
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full select-none cursor-pointer text-left pb-1 ps-2 font-bold xl:text-xl">
            Category
          </AccordionTrigger>
          <AccordionContent className="h-56 border-t-1 border-gray-200 overflow-y-scroll flex flex-col mt-2">
            {categoryNames &&
              categoryNames.map((v, k) => (
                <div
                  className={cn("select-none cursor-pointer w-full ps-3 py-1 hover:bg-gray-500 transition", selectedAuthor == v && "bg-gray-500")}
                  key={k}
                  onClick={() => {
                    selectAuthor(v);
                  }}
                >
                  {v}
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        className="xl:rounded-sm h-fit border-2 border-gray-200"
        type="single"
        collapsible
      >
        <AccordionItem value="item-2">
          <AccordionTrigger className="w-full select-none cursor-pointer text-left pb-1 ps-2 font-bold xl:text-xl">
            Author
          </AccordionTrigger>
          <AccordionContent className="h-56 border-t-1 border-gray-200 overflow-y-scroll flex flex-col mt-2">
            {authorNames &&
              authorNames.map((v, k) => (
                <div
                  className={cn("select-none cursor-pointer w-full ps-3 py-1 hover:bg-gray-500 transition", selectedCategory == v && "bg-gray-500")}
                  key={k}
                  onClick={() => {
                    selectCategory(v);
                  }}
                >
                  {v}
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        className="xl:rounded-sm h-fit border-2 border-gray-200"
        type="single"
        collapsible
      >
        <AccordionItem value="item-3">
          <AccordionTrigger className="w-full select-none cursor-pointer text-left pb-1 ps-2 font-bold xl:text-xl">
            Rating Review
          </AccordionTrigger>
          <AccordionContent className="h-fit border-t-1 border-gray-200 flex flex-col mt-2">
            {ratingList &&
              ratingList.map((v, k) => (
                <div
                  className={cn("select-none cursor-pointer w-full ps-3 py-1 hover:bg-gray-500 transition", selectedRating == `${v} Star` && "bg-gray-500")}
                  key={k}
                  onClick={() => {
                    selectRating(`${v} Star`);
                  }}
                >
                  {v} Star
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterSection;
