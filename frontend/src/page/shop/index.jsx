import FilterSection from "./filterSection";
import ListSection from "./listSection";
import { QueryProvider } from "./usequeryContext";

const ShopPage = () => {
  return (
    <QueryProvider>
      <div>
        <div className="py-8 mb-12 border-b-2 border-gray-200 xl:text-xl font-bold">Books <span className="text-base font-normal text-gray-300">(Filtered by Category #1)</span></div>
      </div>
      <div className="mb-16 grid grid-cols-[20%_auto] gap-4">
        <FilterSection />
        <ListSection />
      </div>
    </QueryProvider>
  );
};

export default ShopPage;
