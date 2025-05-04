import { createOrder, validateCart } from "@/api/order";
import { toastError } from "@/components/toast";

export const MinQuantity = import.meta.env.VITE_MIN_ITEM_QUANTITY;
export const MaxQuantity = import.meta.env.VITE_MAX_ITEM_QUANTITY;

class StorageCartItem {
  constructor(bookId, quantity) {
    this.bookId = bookId;
    this.quantity = quantity;
  }
}

class CartItem {
  constructor(item) {
    this.bookId = item.book_id;
    this.bookTitle = item.book_title;
    this.bookSummary = item.book_summary;
    this.authorName = item.author_name;
    this.bookCoverPhoto = item.book_cover_photo;
    this.quantity = item.quantity;
    this.available = item.available;
    this.bookPrice = item.book_price;
    this.finalPrice = item.final_price;
    this.totalPrice = item.total_price;
    this.discountStartDate = item.discount_start_date;
    this.discountEndDate = item.discount_end_date;
    this.exceptionDetails = item.exception_details;
  }
}

class Cart {
  constructor(data = null) {
    if (data != null) {
      this.exceptionDetails = data.exception_details;
      this.items = data.validated_items.map((v) => new CartItem(v));
    } else {
      this.exceptionDetails = null;
      this.items = [];
    }
  }
}

const cartPrefix = "cart";
const guestKey = "guest";

export const getKey = (user) => {
  return user != undefined ? user.email : guestKey;
};

export const getValidatedCart = async (user) => {
  const items = getCartFromStorage(getKey(user));
  if (items == null || items.length == 0) {
    return {
      data: new Cart(),
    };
  }
  const response = await validateCart(items);
  if (response.error) {
    const cart = new Cart();
    return {
      erroMessage: response.message,
      data: cart,
    };
  } else {
    const cart = new Cart(response.data);
    return {
      data: cart,
    };
  }
};

export const checkoutCart = async (user, items) => {
  const response = await createOrder(items);
  if (response.error) {
    //Remove bad items
    const errors = response.errorMessage.split("|");
    const bookIds = [];
    for (const error of errors) {
      const [bookId] = error.split(":");
      const parsedId = parseInt(bookId);
      if (Number.isInteger(parsedId) && !bookIds.includes(parsedId)) {
        bookIds.push(parsedId);
      }
    }
    for (const id of bookIds) {
      removeFromCart(user, id);
    }
    return {
      erroMessage: `Removed invalid items: Books[${bookIds.join(",")}]`,
    };
  } else {
    removeCartFromStorage(getKey(user));
    return {
      successMessage: response.successMessage,
    };
  }
};

export const addToCart = (user, bookId, quantity) => {
  const userKey = getKey(user);
  let cart = getCartFromStorage(userKey);
  if (cart == null) cart = [];
  let item = new StorageCartItem(bookId, quantity);
  const existingItem = cart.find((v) => v.bookId == bookId);
  if (existingItem != undefined) {
    item.quantity = Math.min(
      item.quantity + existingItem.quantity,
      MaxQuantity
    );
    item.quantity = Math.max(item.quantity, MinQuantity);
    cart = cart.filter((item) => item != existingItem);
  }
  cart.push(item);
  setCartFromStorage(userKey, cart);
  return item;
};

export const removeFromCart = (user, bookId) => {
  const userKey = getKey(user);
  let cart = getCartFromStorage(userKey);
  if (cart == null) cart = [];
  const existingItem = cart.find((v) => v.bookId == bookId);
  if (existingItem != undefined) {
    cart = cart.filter((item) => item != existingItem);
  }
  setCartFromStorage(userKey, cart);
};

export const checkConflictingCart = (user) => {
  if (user != undefined) {
    const guestCart = getCartFromStorage(guestKey);
    if (guestCart != null && guestCart.length > 0) {
      mergeCart(user);
    }
  }
};

const mergeCart = (user) => {
  const userKey = getKey(user);
  const guestCart = getCartFromStorage(guestKey);
  let userCart = getCartFromStorage(userKey);
  if (userCart == null) userCart = [];
  userCart = removeDuplicates([...guestCart, ...userCart]);
  setCartFromStorage(userKey, userCart);
  removeCartFromStorage(guestKey);
};

export const updateQuantityFromCart = (user, bookId, value) => {
  const userKey = getKey(user);
  let cart = getCartFromStorage(userKey);
  const selectedItem = cart.find((v) => v.bookId == bookId);
  if (selectedItem != undefined) {
    selectedItem.quantity = value;
    cart = cart.filter((item) => item != selectedItem);
    cart.push(selectedItem);
    setCartFromStorage(userKey, cart);
  } else {
    throw Error("This book isn't in cart");
  }
};

const removeDuplicates = (items) => {
  const uniqueItems = new Map();
  items.forEach((item) => {
    const { bookId, quantity } = item;
    if (
      !uniqueItems.has(bookId) ||
      quantity > uniqueItems.get(bookId).quantity
    ) {
      uniqueItems.set(bookId, item);
    }
  });
  return Array.from(uniqueItems.values());
};

const getCartFromStorage = (key) => {
  const cartString = localStorage.getItem(`${cartPrefix}-${key}`);
  return JSON.parse(cartString);
};

const setCartFromStorage = (key, value) => {
  localStorage.setItem(
    `${cartPrefix}-${key}`,
    JSON.stringify(removeDuplicates(value))
  );
};

const removeCartFromStorage = (key) => {
  localStorage.removeItem(`${cartPrefix}-${key}`);
};
