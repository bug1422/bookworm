import { Outlet } from "react-router-dom";
import Navigation from "../component/navigation";

const UserLaytout = () => {
  return (
    <div className="">
      <Navigation />
      <div className="mx-16">
      <Outlet />
      </div>
    </div>
  );
};
export default UserLaytout;
