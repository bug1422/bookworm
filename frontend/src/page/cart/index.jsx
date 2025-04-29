import SkeletonLoader from "@/components/fallback/skeletonLoader";
import QuantityButton from "@/components/quantityButton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const CartProduct = ({
  bookId = undefined,
  bookTitle = undefined,
  authorName = undefined,
  img_path = undefined,
}) => {
  var isUndefined = bookId === undefined;
  return (
    <div className="flex py-4">
      <img
        src={"/assets/book-placeholder.png"}
        alt="cart-img"
        className="w-30 aspect-square rounded-xl"
      />
      <div className="self-center flex flex-col gap-4">
        {isUndefined ? (
          <SkeletonLoader width={"32"} height={"6"} />
        ) : (
          <div className=""></div>
        )}
        {isUndefined ? <SkeletonLoader width={"24"} /> : <div className=""></div>}
      </div>
    </div>
  );
};

const CartRow = ({ book = undefined }) => {
  return (
    <div className={cn("col-span-4 grid grid-cols-subgrid px-6")}>
      <div className="">
        <CartProduct
          bookId={book?.id}
          bookTitle={book?.book_title}
          authorName={book?.author_name}
        />
      </div>
      <div className={cn("flex flex-col gap-4 h-full justify-center")}>
        <SkeletonLoader height={"6"} />
        <SkeletonLoader width={"20"} />
      </div>
      <div className={cn("flex flex-col h-full justify-center")}>
        <QuantityButton />
      </div>
      <div
        className={cn(
          "flex flex-col h-full justify-center",
        )}
      >
        <SkeletonLoader height={"6"} width={"20"} />
      </div>
    </div>
  );
};
const CartPage = () => {
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => validateCart(),
  });
  const validateCart = async () => {
    // sth sth
    return [];
  };
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
          ) : (
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
          )}
        </div>
        <div className="h-fit border-2 py-6 flex flex-col items-center border-gray-200 rounded-md overflow-hidden">
          <div className="font-bold pb-4 border-b-2 border-gray-300 w-full text-center">
            Cart Totals
          </div>
          <div className="my-10 text-3xl font-bold">0</div>
          <div
            variant="secondary"
            className="w-3/4 font-bold mb-4 rounded-sm bg-gray-200 text-center p-2 hover:bg-gray-500 hover:text-white select-none cursor-pointer transition duration-100"
          >
            Place Order
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
