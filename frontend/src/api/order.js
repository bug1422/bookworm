import { api, getCartErrorResponse, getDataResponse, getErrorReponse } from '.';
const routePath = '/orders';

export const validateCart = async (items) => {
  try {
    const body = items.map((v) => {
      return {
        book_id: v.bookId,
        quantity: v.quantity,
      };
    });
    const response = await api.post(routePath + '/validate', body);
    return getDataResponse(response);
  } catch (error) {
    return getCartErrorResponse(error);
  }
};

export const createOrder = async (items) => {
  try {
    const body = items.map((v) => {
      return {
        book_id: v.bookId,
        cart_price: Math.round(v.quantity * v.finalPrice * 100) / 100,
        quantity: v.quantity,
      };
    });
    const response = await api.post(routePath, body);
    return getDataResponse(response);
  } catch (error) {
    return getErrorReponse(error);
  }
};
