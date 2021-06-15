import { ADD_ORDER, SET_ORDERS } from "../actions/orderA";
import Order from "../../models/order";

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.orders,
      };
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id, // generaates an id of as the day (dummy id)
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date // current day
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder), // save new orders in to the orders array,by adding it on top
      };
  }

  return state;
};
