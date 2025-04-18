import { useLocation, useNavigate } from "react-router-dom";
import SignInDialog from "./signin";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const Nav = ({ children, link }) => {
    return <div className={cn(location.pathname.includes(link) && "underline decoration-2", "select-none cursor-pointer")} onClick={()=>{
        navigate(link)
    }}>{children}</div>;
  };
  return (
    <header className="py-3 flex flex-row justify-between w-full bg-gray-200">
      <div className="ms-6 flex items-center gap-2">
        <img src="https://placehold.co/32x32" alt="bookworm-logo" />
        <div className="font-bold xl:text-3xl">BOOKWORM</div>
      </div>
      <div className="flex gap-12 me-16 items-center">
        <Nav link="/home">Home</Nav>
        <Nav link="/shop">Shop</Nav>
        <Nav link="/about">About</Nav>
        <Nav link="/cart">Cart</Nav>
        <SignInDialog/>
        {/* last is a pop up sign in */}
      </div>
    </header>
  );
};

export default Header;
