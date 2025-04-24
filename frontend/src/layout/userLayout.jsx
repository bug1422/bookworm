import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "@/components/footer";
import { SearchProvider } from "@/components/context/useSearch";

const UserLayout = () => {
  return (
    <div className="">
      <SearchProvider>
        <Header />
        <div className="min-h-[80vh] mx-16">
          <Outlet />
        </div>
        <Footer />
      </SearchProvider>
    </div>
  );
};
export default UserLayout;
