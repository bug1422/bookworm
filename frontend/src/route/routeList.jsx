import AboutPage from "../page/about";
import CartPage from "../page/cart";
import HomePage from "../page/home";
import ProductPage from "../page/product";
import ShopPage from "../page/shop";
import {Navigate} from "react-router-dom"
export const SiteRoutes = [
  {
    path: "/",
    element: <Navigate to={"/home"} replace />
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/product:productId",
    element: <ProductPage />,
  },
];
