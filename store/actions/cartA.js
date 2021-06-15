export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
//How to set up actions for adding items in memory

export const addToCart = (product) => {
  return { type: ADD_TO_CART, product: product };
};

export const removeFromCart = (productId) => {
  return { type: REMOVE_FROM_CART, pId: productId };
};
