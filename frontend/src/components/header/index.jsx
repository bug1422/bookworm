import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/useAuthContext";
import SpinningCircle from "../icons/loading";
import { SignInDialog } from "./signin";
import { AlignJustifyIcon } from "lucide-react";
import { useState } from "react";
import { toastError, toastSuccess } from "../toast";
import ProfileDropdown from "./ProfileDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const HeaderNav = ({
  className = "",
  onLink = "underline decoration-2",
  notOnLink = "",
  children,
  link,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLink = location.pathname.includes(link);
  return (
    <div
      className={cn(
        isLink ? onLink : notOnLink,
        className,
        "select-none cursor-pointer"
      )}
      onClick={() => {
        navigate(link);
      }}
    >
      {children}
    </div>
  );
};

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);

  const { user, cart, userIsLoading, isAuthenticated, signout } = useAuth();
  const itemCount = cart?.items?.length ?? 0;
  const headerSignout = async () => {
    try {
      await signout();
      document.cookie =
        "access_token=; Max-Age=0; path=/; Secure; SameSite=None";
      document.cookie =
        "refresh_token=; Max-Age=0; path=/; Secure; SameSite=None";
      toastSuccess("Signout success");
    } catch (e) {
      toastError("Signout failed", e.message);
    }
  };
  return (
    <header className="h-[10vh] py-3 px-4 sm:px-6 flex justify-between w-full bg-indigo-300 relative">
      <div className="sm:ms-6 flex items-center gap-2">
        <img src="/assets/book-placeholder.png" alt="bookworm-header" />
        <div className="font-bold xl:text-3xl">BOOKWORM</div>
      </div>
      <div className="hidden sm:flex gap-6 md:gap-10 lg:gap-12 items-center">
        <HeaderNav link="/home">Home</HeaderNav>
        <HeaderNav link="/shop">Shop</HeaderNav>
        <HeaderNav link="/about">About</HeaderNav>
        <HeaderNav link="/cart">
          Cart {itemCount != 0 && `(${itemCount})`}
        </HeaderNav>
        {userIsLoading ? (
          <SpinningCircle size={10} />
        ) : isAuthenticated ? (
          <ProfileDropdown title={`${user.last_name} ${user.first_name}`}>
            <button
              onClick={headerSignout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Log out
            </button>
          </ProfileDropdown>
        ) : (
          <div
            onClick={() => {
              setOpenSignin(true);
            }}
            className="select-none cursor-pointer text-center"
          >
            Sign In
          </div>
        )}
      </div>
      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger asChild className="sm:hidden flex items-center">
          <button
            onClick={() =>
              setIsOpen((prev) => {
                return !prev;
              })
            }
          >
            <AlignJustifyIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
          className="w-[100vw] p-0 flex flex-col bg-indigo-500 text-white shadow-md rounded-md"
        >
          {user != undefined && (
            <div className="text-center py-2">{`${user.last_name} ${user.first_name}`}</div>
          )}
          <HeaderNav
            className="py-2 text-center w-full"
            onLink="bg-indigo-800"
            link="/home"
          >
            Home
          </HeaderNav>
          <HeaderNav
            className="py-2 text-center w-full"
            onLink="bg-indigo-800"
            link="/shop"
          >
            Shop
          </HeaderNav>
          <HeaderNav
            className="py-2 text-center w-full"
            onLink="bg-indigo-800"
            link="/about"
          >
            About
          </HeaderNav>
          <HeaderNav
            className="py-2 text-center w-full"
            onLink="bg-indigo-800"
            link="/cart"
          >
            Cart {itemCount != 0 && `(${itemCount})`}
          </HeaderNav>
          {userIsLoading ? (
            <span className="py-2">Loading...</span>
          ) : isAuthenticated ? (
            <button
              onClick={headerSignout}
              className="block w-full text-center py-2"
            >
              Log out
            </button>
          ) : (
            <div
              className="py-2 text-center"
              onClick={() => {
                setOpenMenu(false);
                setOpenSignin(true);
              }}
            >
              Sign In
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {!isAuthenticated && (
        <SignInDialog isOpen={openSignin} setIsOpen={setOpenSignin} />
      )}
    </header>
  );
};

export default Header;
