import { Outlet } from "react-router-dom";

const UserLaytout = () => {
  return (
    <div>
        This is a layout
      <Outlet />
    </div>
  );
};
export default UserLaytout;
