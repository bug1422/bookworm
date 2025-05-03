import { useAuth } from "@/components/context/useAuthContext";
import { useOptions } from "@/components/context/useOptionsContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import QuantityButton from "@/components/quantityButton";
import {
  updateQuantityFromCart,
  MaxQuantity,
  MinQuantity,
} from "@/lib/cart";
import eventBus from "@/lib/eventBus";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RecalculatePriceEvent } from "./event";

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
    const { getCurrency } = useOptions();
    const { user } = useAuth();
    const isUndefined = item === undefined;
    const [quantity, setQuantity] = useState(isUndefined ? 1 : item.quantity);
  
    const updateQuantity = (value) => {
      setQuantity((prev) => {
        updateQuantityFromCart(user, item?.bookId, prev + value);
        const event = new CustomEvent(RecalculatePriceEvent, {
          detail: { bookId: item?.bookId, quantity: prev + value },
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
              <span className="text-2xl font-bold">
                {getCurrency(item.finalPrice)}
              </span>
              {item.bookPrice != item.finalPrice && (
                <span className="text-gray-400 line-through">
                  {getCurrency(item.bookPrice)}
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
            <div className="text-2xl font-bold">
              {getCurrency(quantity * item.finalPrice)}
            </div>
          )}
        </div>
      </div>
    );
  };
  export default CartRow