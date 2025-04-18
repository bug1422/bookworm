import { Outlet } from "react-router-dom";
import Header from "../component/header";
import Footer from "@/component/footer";
import { SearchProvider } from "@/component/context/useSearch";

const UserLayout = () => {
  return (
    <div className="">
      <SearchProvider>
        <Header />
        <div className="mx-16">
          <Outlet />
        </div>
        <Footer />
      </SearchProvider>
    </div>
  );
};
export default UserLayout;
