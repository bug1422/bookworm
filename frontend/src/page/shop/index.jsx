import FilterSection from "./filterSection";
import ListSection from "./listSection";
import { QueryProvider } from "./usequeryContext";

const ShopPage = () => {
  return (
    <QueryProvider>
      <div className="grid grid-cols-[20%_auto]">
        <FilterSection />
        <ListSection />
      </div>
    </QueryProvider>
  );
};

export default ShopPage;
