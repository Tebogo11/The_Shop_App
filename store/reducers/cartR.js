import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cartA";
import CartItem from "../../models/cart-item";
import { ADD_ORDER } from "../actions/orderA";
import { DELETE_PRODUCT } from "../actions/productA";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice,
      };
    case REMOVE_FROM_CART:
      const selectedCardItem = state.items[action.pId];
      const currentQty = state.items[action.pId].quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        //If its greater we need to reduce by 1
        updatedCartItems = new CartItem(
          selectedCardItem.quantity - 1,
          selectedCardItem.productPrice,
          selectedCardItem.productTitle,
          selectedCardItem.sum - selectedCardItem.productPrice
        ); //create a new caritem with all the same values
        updatedCartItems = { ...state.items, [action.pId]: updatedCartItems };
      } else {
        //we erase it
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pId]; // this will delete the item with that Id
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCardItem.productPrice,
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state; // if item is already in state then keep it
      }
      const updatedItems = { ...state.items }; //creare new item state
      const itemTotal = state.items[action.pid].sum; // total sum of all the products with thes same ID
      delete updatedItems[action.pid]; // delete product with that ID
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
  }
  return state;
};
