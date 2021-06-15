export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";
import Order from "../../models/order";

export const fetchOrder = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://the-shop-app-71907-default-rtdb.firebaseio.com/orders/${userId}.json`
      );

      // checks for errors
      if (!response.ok) {
        throw new Error("Something want wrong ");
      }
      //Saving data in google firebase
      const resData = await response.json();
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date) //reformat to date object
          )
        );
      }

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      // send to custom analystic server
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const date = new Date();
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://the-shop-app-71907-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );
    //Saving data in google firebase
    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
};
