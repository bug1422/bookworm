import { Outlet } from "react-router-dom";
import Navigation from "../component/navigation";

const UserLaytout = () => {
  return (
    <div className="">
      <Navigation />
      <Outlet />
    </div>
  );
};
export default UserLaytout;
