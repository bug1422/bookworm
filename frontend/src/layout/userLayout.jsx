import { Outlet } from "react-router-dom";
import Header from "../component/header";
import Footer from "@/component/footer";

const UserLaytout = () => {
  return (
    <div className="">
      <Header />
      <div className="mx-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default UserLaytout;
