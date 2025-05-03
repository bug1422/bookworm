import { useAuth } from "@/components/context/useAuthContext";
import { useOptions } from "@/components/context/useOptionsContext";
import SkeletonLoader from "@/components/fallback/skeletonLoader";
import QuantityButton from "@/components/quantityButton";
import { toastError, toastSuccess } from "@/components/toast";
import { addToCart, MaxQuantity, MinQuantity } from "@/lib/cart";
import { useState } from "react";

const BookDetail = ({ book = undefined, bookIsLoading = true }) => {
  return (
    <>
      <div className="">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${book.book_cover_photo}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/book-placeholder.png";
          }}
          alt="book-image"
          className="object-center w-[24rem] bg-gray-100 rounded-s-md"
        />
        {bookIsLoading ? (
          <SkeletonLoader width={"24"} className="ms-auto mt-4" />
        ) : (
          <div className="text-right text-gray-400">
            By (author) <span className="font-bold">{book.author_name}</span>{" "}
          </div>
        )}
      </div>
      <div className="mt-6 min-h-80 flex flex-col gap-6 w-full me-4">
        {bookIsLoading ? (
          <SkeletonLoader height={"6"} width={"25"} />
        ) : (
          <div className="text-xl font-bold">{book.book_title}</div>
        )}
        {bookIsLoading ? (
          <>
            {Array(6)
              .fill(0)
              .map((v) => (
                <SkeletonLoader width={"full"} />
              ))}
          </>
        ) : (
          <div className="text-xl">{book.book_summary}</div>
        )}
      </div>
    </>
  );
};
const AddToCart = ({ book = undefined, bookIsLoading = true }) => {
  const { getCurrency } = useOptions()
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const addBookToCart = () => {
    if (book != undefined) {
      const item = addToCart(user, book.id, quantity);
      toastSuccess(
        "Added to cart",
        `Book ${
          book.book_title.length <= 8
            ? book.book_title
            : book.book_title.substring(0, 8) + "..."
        } has been added. \nTotal quantity: ${item.quantity}`
      );
    } else {
      toastError("Failt to add", "Can't get book");
    }
  };
  return (
    <>
      <div className="bg-gray-200 p-7">
        {bookIsLoading ? (
          <SkeletonLoader width="1/3" />
        ) : (
          <div className="">
            {book.is_on_sale && (
              <span className="text-gray-400 line-through me-3">
                {getCurrency(book.book_price)}
              </span>
            )}
            <span className="text-xl font-bold">
              {getCurrency(book.final_price)}
            </span>
          </div>
        )}
      </div>
      <div className="p-7">
        Quantity
        <QuantityButton
          className="w-full mt-3 mb-5"
          quantity={quantity}
          onIncrease={() => {
            setQuantity((prev) => {
              if (prev != MaxQuantity) return prev + 1;
              return prev;
            });
          }}
          onDecrease={() => {
            setQuantity((prev) => {
              if (prev != MinQuantity) return prev - 1;
              return prev;
            });
          }}
        />
        <div
          onClick={() => {
            addBookToCart();
          }}
          className="select-non cursor-pointer transition bg-gray-200 hover:bg-gray-500 text-center font-bold text-2xl p-2 my-10"
        >
          Add to cart
        </div>
      </div>
    </>
  );
};

const BookDetailSection = ({ book = undefined, bookIsLoading = true }) => {
  return (
    <>
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-5 flex border-1 border-gray-200 rounded-md gap-16">
          <BookDetail book={book} bookIsLoading={bookIsLoading} />
        </div>
        <div className="h-fit divide-x-2 flex flex-col col-span-2 border-1 border-gray-200 rounded-md">
          <AddToCart book={book} bookIsLoading={bookIsLoading} />
        </div>
      </div>
    </>
  );
};

export default BookDetailSection;
