import { useAuth } from "@/components/context/useAuthContext";
import { useOptions } from "@/components/context/useOptionsContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import QuantityButton from "@/components/quantityButton";
import {
  updateQuantityFromCart,
  MaxQuantity,
  MinQuantity,
  removeFromCart,
} from "@/lib/cart";
import eventBus from "@/lib/eventBus";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RecalculatePriceEvent } from "./event";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toastError, toastSuccess } from "@/components/toast";
import { useQueryClient } from "@tanstack/react-query";

const CartProduct = ({ item = undefined }) => {
  const isUndefined = item === undefined;
  return (
    <div className="flex py-4 col-span-1 flex-col md:flex-row">
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}${item?.bookCoverPhoto}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/book-placeholder.png";
        }}
        alt="cart-img"
        className="w-30 aspect-square rounded-xl mb-4 sm:mb-2 mx-auto md:mx-0"
      />
      <div className="self-center flex flex-col gap-2 text-left">
        {isUndefined ? (
          <SkeletonLoader width={"16"} height={"6"} />
        ) : (
          <div className="text-sm sm:text-lg font-bold">{item.bookTitle}</div>
        )}
        {isUndefined ? (
          <SkeletonLoader width={"32"} height={"4"} />
        ) : (
          <div className="text-sm sm:text-base">{item.authorName}</div>
        )}
      </div>
    </div>
  );
};

const CartRow = ({ item = undefined }) => {
  const queryClient = useQueryClient()
  
  const { getCurrency } = useOptions();
  const { user } = useAuth();
  const isUndefined = item === undefined;
  const [quantity, setQuantity] = useState(isUndefined ? 1 : item.quantity);

  const updateQuantity = (value) => {
    try {
      setQuantity((prev) => {
        updateQuantityFromCart(user, item?.bookId, prev + value);
        const event = new CustomEvent(RecalculatePriceEvent, {
          detail: { bookId: item?.bookId, quantity: prev + value },
        });
        eventBus.dispatchEvent(event);
        return prev + value;
      });
    } catch (e) {
      toastError("Can't update quantity", e.message);
    }
  };

  const removeItem = () => {
    if (item === undefined) return;
    try {
      const bookTitle = item.bookTitle;
      removeFromCart(user, item?.bookId);
      queryClient.invalidateQueries("cart")
      toastSuccess("Success", "Remove " + bookTitle + " from cart");
    } catch (e) {
      toastError("Can't update quantity", e.message);
    }
  };
  return (
    <div
      className={cn(
        "col-span-4 grid grid-cols-[30%_20%_30%_auto] sm:grid-cols-[40%_20%_20%_auto] px-6 py-4"
      )}
    >
      <CartProduct item={item} />
      <div className="flex flex-col gap-4 justify-center">
        {isUndefined ? (
          <>
            <SkeletonLoader height="6" />
            <SkeletonLoader width="20" />
          </>
        ) : (
          <>
            <span className="sm:text-2xl font-bold">
              {getCurrency(item.finalPrice)}
            </span>
            {item.bookPrice !== item.finalPrice && (
              <span className="text-gray-400 line-through">
                {getCurrency(item.bookPrice)}
              </span>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-3 flex-shrink-0 justify-center">
        <QuantityButton
          onDecrease={() => {
            if (item && quantity !== MinQuantity) {
              updateQuantity(-1);
            }
          }}
          onIncrease={() => {
            if (item && quantity !== MaxQuantity) {
              updateQuantity(1);
            }
          }}
          quantity={quantity}
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeItem()}
          className="mt-2 w-full hover:bg-red-800 cursor-pointer"
        >
          <Trash2 className="" />
          Remove
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center">
        {isUndefined ? (
          <SkeletonLoader height="6" width="20" />
        ) : (
          <div className="sm:text-2xl font-bold">
            {getCurrency(quantity * item.finalPrice)}
          </div>
        )}
      </div>
    </div>
  );
};
export default CartRow;
