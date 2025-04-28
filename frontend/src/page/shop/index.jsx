import { useLocation } from "react-router-dom";
import FilterSection from "./filterSection";
import ListSection from "./listSection";
import {
  BookQueryProvider,
  useBookQuery,
} from "@/components/context/useBooksQueryContext";
import { SearchProvider } from "@/components/context/useSearch";

const ShopTitle = () => {
  const { selectedAuthor, selectedCategory, selectedRating } = useBookQuery();
  const getCurrentFilter = () => {
    const current = [selectedAuthor, selectedCategory, selectedRating].filter(
      (p) => p !== null
    );
    if (current.length > 0) {
      return `(Filtered by ${current.join(", ")})`;
    }
    return ``;
  };
  return (
    <div>
      <div className="py-8 mb-12 border-b-2 border-gray-200 xl:text-2xl font-bold">
        Books
        <span className="ms-2 text-base font-normal text-gray-500">
          {getCurrentFilter()}
        </span>
      </div>
    </div>
  );
};
const ShopPage = () => {
  return (
    <SearchProvider>
      <BookQueryProvider>
        <ShopTitle />
        <div className="mb-16 grid grid-cols-[14%_auto] gap-4">
          <FilterSection />
          <ListSection />
        </div>
      </BookQueryProvider>
    </SearchProvider>
  );
};

export default ShopPage;
