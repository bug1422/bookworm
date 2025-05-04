import { useAuth } from "@/components/context/useAuthContext";
import { useOptions } from "@/components/context/useOptionsContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import { DialogOpenEvent } from "@/components/header/signin";
import SpinningCircle from "@/components/icons/loading";
import { toastError, toastSuccess } from "@/components/toast";
import { checkoutCart } from "@/lib/cart";
import eventBus from "@/lib/eventBus";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartTotal = ({ totalPrice }) => {
  const { getCurrency } = useOptions();
  return (
    <div className="my-10 text-3xl font-bold">{getCurrency(totalPrice)}</div>
  );
};

export const CartCheckout = ({ items, totalPrice }) => {
  if (items === undefined)
    return (
      <div className="h-fit border-2 py-6 flex flex-col items-center border-gray-200 rounded-md overflow-hidden">
        <div className="font-bold pb-4 border-b-2 border-gray-300 w-full text-center">
          Cart Totals
        </div>

        {/* Skeleton Loader for loading state */}
        <div className="my-6">
          <SkeletonLoader width="50" />
        </div>

        {/* Place Order Button */}
        <div className="w-3/4 sm:w-full font-bold mb-4 rounded-sm bg-gray-200 text-center p-2 hover:bg-gray-500 hover:text-white select-none cursor-pointer transition duration-100">
          Place Order
        </div>
      </div>
    );

  const queryClient = useQueryClient();
  const { isAuthenticated, user,refetchCart } = useAuth();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const checkout = async () => {
    setLoading(true);
    if (!isAuthenticated) {
      eventBus.dispatchEvent(new CustomEvent(DialogOpenEvent));
    } else {
      try {
        const response = await checkoutCart(user, items);
        await refetchCart()
        if (response.erroMessage != undefined) {
          toastError("Cart checkout failed", "We have removed invalid items from your cart\n"+response.erroMessage);
        } else {
          toastSuccess("Cart checkout success");
          setTimeout(() => {
            navigate("/");
          }, 10000);
        }
      } catch (e) {
        console.log(e);
      }
    }
    setLoading(false);
  };

  return (
    <div className="h-fit border-2 py-6 flex flex-col items-center border-gray-200 rounded-md overflow-hidden">
      <div className="font-bold pb-4 border-b-2 border-gray-300 w-full text-center">
        Cart Totals
      </div>
      <CartTotal totalPrice={totalPrice} />
      <div
        className="w-3/4 flex justify-center font-bold mb-4 rounded-sm bg-gray-200 text-center p-2 hover:bg-gray-500 hover:text-white select-none cursor-pointer transition duration-100"
        onClick={() => {
          checkout();
        }}
      >
        {loading ? <SpinningCircle /> : <>Place Order</>}
      </div>
    </div>
  );
};
