import { Outlet } from "react-router-dom";
import Navigation from "../component/navigation";

const UserLaytout = () => {
  return (
    <div className="">
      <Navigation />
      <div className="ms-3 me-16">
      <Outlet />
      </div>
    </div>
  );
};
export default UserLaytout;
