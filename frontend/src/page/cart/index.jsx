import { useAuth } from "@/components/context/useAuthContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import { DialogOpenEvent } from "@/components/header/signin";
import QuantityButton from "@/components/quantityButton";
import { toastError, toastSuccess } from "@/components/toast";
import {
  updateQuantityFromCart,
  getValidatedCart,
  checkoutCart,
  getKey as getCartKey,
  MaxQuantity,
  MinQuantity,
} from "@/lib/cart";
import eventBus from "@/lib/eventBus";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecalculatePriceEvent = "recalculateTotal";

const CartProduct = ({ item = undefined }) => {
  const isUndefined = item === undefined;
  return (
    <div className="flex py-4">
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}${item?.bookCoverPhoto}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/book-placeholder.png";
        }}
        alt="cart-img"
        className="w-30 aspect-square rounded-xl me-5"
      />
      <div className="self-center flex flex-col gap-4">
        {isUndefined ? (
          <SkeletonLoader width={"32"} height={"6"} />
        ) : (
          <>
            <div className="">{item.bookTitle}</div>
          </>
        )}
      </div>
    </div>
  );
};

const CartRow = ({ item = undefined }) => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const isUndefined = item === undefined;

  const updateQuantity = (value) => {
    setQuantity((prev) => {
      updateQuantityFromCart(user, item.bookId, prev + value);
      const event = new CustomEvent(RecalculatePriceEvent, {
        detail: { bookId: item.bookId, quantity: prev + value },
      });
      eventBus.dispatchEvent(event);
      return prev + value;
    });
  };
  return (
    <div className={cn("col-span-4 grid grid-cols-subgrid px-6")}>
      <div className="">
        <CartProduct item={item} />
      </div>
      <div className={cn("flex flex-col gap-4 h-full justify-center")}>
        {isUndefined ? (
          <>
            <SkeletonLoader height={"6"} />
            <SkeletonLoader width={"20"} />
          </>
        ) : (
          <>
            <span className="text-2xl font-bold">{item.finalPrice}</span>
            {item.bookPrice != item.finalPrice && (
              <span className="text-gray-400 line-through">
                {item.bookPrice}
              </span>
            )}
          </>
        )}
      </div>
      <div className={cn("flex flex-col h-full justify-center")}>
        <QuantityButton
          onDecrease={() => {
            if (item != undefined && quantity != MinQuantity) {
              updateQuantity(-1);
            }
          }}
          onIncrease={() => {
            if (item != undefined && quantity != MaxQuantity) {
              updateQuantity(1);
            }
          }}
          quantity={quantity}
        />
      </div>
      <div className={cn("flex flex-col h-full justify-center")}>
        {isUndefined ? (
          <SkeletonLoader height={"6"} width={"20"} />
        ) : (
          <div className="text-2xl font-bold">{quantity * item.finalPrice}</div>
        )}
      </div>
    </div>
  );
};

const CartPage = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart-" + getCartKey(user)],
    queryFn: () => GetCart(),
  });
  const GetCart = async () => {
    const validateResponse = await getValidatedCart(user);
    if (validateResponse.data == undefined) {
      toastError("Cart validation failed", validateResponse.erroMessage);
    }
    return validateResponse.data;
  };

  const checkout = async () => {
    if (!isAuthenticated) {
      eventBus.dispatchEvent(new CustomEvent(DialogOpenEvent));
    } else {
      if (cart != undefined) {
        const response = await checkoutCart(user,cart.items);
        if (response.erroMessage != undefined) {
          toastError("Cart checkout failed", response.erroMessage);
        } else {
          toastSuccess("Cart checkout success");
        }
      }
    }
  };

  useEffect(() => {
    const recalculateCartPrice = (bookId, quantity) => {
      if (cart.items !== undefined) {
        const newPrice = cart.items.reduce((total, v) => {
          return (
            total +
            (v.bookId === bookId
              ? quantity * v.finalPrice
              : v.quantity * v.finalPrice)
          );
        }, 0);
        setTotalPrice(newPrice);
      }
    };
    const handleRecalculatePrice = (event) => {
      recalculateCartPrice(event.detail.bookId, event.detail.quantity);
    };
    eventBus.addEventListener(RecalculatePriceEvent, handleRecalculatePrice);
    return () => {
      eventBus.removeEventListener(
        RecalculatePriceEvent,
        handleRecalculatePrice
      );
    };
  }, []);
  useEffect(() => {
    if (cart?.items != undefined) {
      const newPrice = cart.items.reduce((total, v) => {
        return total + v.quantity * v.finalPrice;
      }, 0);
      setTotalPrice(newPrice);
    }
  }, [cart]);
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
          {isLoading ? (
            <>
              <CartRow />
              <CartRow />
            </>
          ) : cart?.items.length == 0 ? (
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
              {cart.items.map((v, k) => (
                <CartRow item={v} key={k} />
              ))}
            </>
          )}
        </div>
        <div className="h-fit border-2 py-6 flex flex-col items-center border-gray-200 rounded-md overflow-hidden">
          <div className="font-bold pb-4 border-b-2 border-gray-300 w-full text-center">
            Cart Totals
          </div>
          <div className="my-10 text-3xl font-bold">{totalPrice}</div>
          <div
            className="w-3/4 font-bold mb-4 rounded-sm bg-gray-200 text-center p-2 hover:bg-gray-500 hover:text-white select-none cursor-pointer transition duration-100"
            onClick={() => {
              checkout();
            }}
          >
            Place Order
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
