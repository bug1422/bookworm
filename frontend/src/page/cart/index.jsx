import { useAuth } from "@/components/context/useAuthContext";
import { toastError } from "@/components/toast";
import { getValidatedCart, getKey as getCartKey } from "@/lib/cart";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartCheckout } from "./cartCheckout";
import CartRow from "./cartRow";
import eventBus from "@/lib/eventBus";
import { RecalculatePriceEvent } from "./event";

const CartPage = () => {
  const { user, userIsLoading} = useAuth();
  const { data: cart, isLoading }  = useQuery({
    queryKey: ["cart"],
    queryFn: () => FetchCart(),
    enabled: !userIsLoading
  })
  const [items, setItems] = useState(cart?.items)

  const FetchCart = async () => {
    const validationResponse = await getValidatedCart(user)
    console.log()
    if(validationResponse.data === undefined)
    {
      toastError("validate cart failed",validationResponse.erroMessage)
      return null
    }
    else{
      return validationResponse.data
    }
  }

  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const refreshItems = (bookId, quantity) => {
      setItems((prev) =>
        prev.map((item) =>
          item.bookId === bookId ? { ...item, quantity } : item
        )
      );
    };
    const handleRefreshItems = (event) => {
      refreshItems(event.detail.bookId, event.detail.quantity);
    };
    eventBus.addEventListener(RecalculatePriceEvent, handleRefreshItems);
    return () => {
      eventBus.removeEventListener(RecalculatePriceEvent, handleRefreshItems);
    };
  }, []);

  useEffect(() => {
    if (items !== undefined) {
      const newPrice = items.reduce((total, v) => {
        return total + v.quantity * v.finalPrice;
      }, 0);
      setTotalPrice(newPrice);
    }
  }, [items]);

  return (
    <div className="">
      <div className="py-8 mb-12 border-b-2 border-gray-200 xl:text-2xl font-bold">
        Your cart
      </div>
      <div className="grid grid-cols-3 gap-16">
        <div className="col-span-2 py-6 grid grid-cols-[40%_20%_20%_auto] divide-y-2 border-2 border-gray-200 rounded-md overflow-hidden">
          <div className="col-span-4 grid grid-cols-subgrid border-b-2 border-gray-300 px-6 pb-4">
            <div className="font-bold">Product</div>
            <div className="font-bold">Price</div>
            <div className="font-bold">Quantity</div>
            <div className="font-bold">Total</div>
          </div>
          {isLoading || userIsLoading ? (
            <>
              <CartRow />
              <CartRow />
            </>
          ) : items?.length == 0 ? (
            <div className="col-span-full flex flex-col justify-center text-center h-64">
              <div>
                <div className="font-bold text-4xl mb-6">
                  Your Cart Is Empty!
                </div>
                <Link
                  className="font-light text-base text-white bg-black p-3 rounded-md hover:text-black hover:bg-gray-200 trasition duration-100"
                  to="/shop"
                >
                  Find your book here
                </Link>
              </div>
            </div>
          ) : (
            <>
              {items.map((v, k) => (
                <CartRow item={v} key={k} />
              ))}
            </>
          )}
        </div>
        <CartCheckout items={items} totalPrice={totalPrice} />
      </div>
    </div>
  );
};

export default CartPage;
