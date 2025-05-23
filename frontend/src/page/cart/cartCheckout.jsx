import { useAuth } from '@/components/context/useAuthContext';
import { useOptions } from '@/components/context/useOptionsContext';
import SkeletonLoader from '@/components/fallback/skeletonLoader';
import { DialogOpenEvent } from '@/components/header/signin';
import SpinningCircle from '@/components/icons/loading';
import {
  toastDismiss,
  toastError,
  toastInfo,
  toastSuccess,
} from '@/components/toast';
import { checkoutCart } from '@/lib/cart';
import eventBus from '@/lib/eventBus';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const CartCheckoutToastId = 'redirecting_id';

const CartTotal = ({ totalPrice }) => {
  const { getCurrency } = useOptions();
  return (
    <div className="my-10 text-3xl font-bold">{getCurrency(totalPrice)}</div>
  );
};
const NavigatingBackBtn = ({ navigate, toastId = null, second = 10 }) => {
  const [time, setTime] = useState(second);
  const navigating = () => {
    navigate('/');
    toastDismiss(toastId);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          navigating();
          return 0;
        }
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      Navigating back to home in {time}s
      <div
        onClick={() => {
          navigating();
        }}
        className="underline font-bold select-none cursor-pointer"
      >
        Go back now
      </div>
    </>
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
  const navigate = useNavigate();
  const { isAuthenticated, user, refetchCart } = useAuth();
  const [loading, setLoading] = useState();
  const checkout = async () => {
    setLoading(true);
    if (!isAuthenticated) {
      eventBus.dispatchEvent(new CustomEvent(DialogOpenEvent));
    } else {
      if (items.length == 0) {
        toastInfo('Cart is empty', 'Go add some book');
      } else {
        try {
          const response = await checkoutCart(user, items);
          await refetchCart();
          if (!response.isSuccess) {
            if (response.isRevalidated) {
              toastError('Cart checkout failed', response.erroMessage);
            }
          } else {
            toastSuccess(
              'Cart checkout success',
              <NavigatingBackBtn
                navigate={navigate}
                toastId={CartCheckoutToastId}
              />,
              CartCheckoutToastId,
              11000,
            );
          }
        } catch (e) {
          console.log(e);
        }
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
