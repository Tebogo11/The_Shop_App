import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constant/Colors";
import CartItem from "../../components/shop/CartItem";

import * as cartActions from "../../store/actions/cartA";
import * as orderAction from "../../store/actions/orderA";
const Cart = (props) => {
  const [isLoading, setisLoading] = useState(false);

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    } // create an array with all the items in the items redux store for Cart
    return transformedCartItems.sort((a, b) => {
      a.productId > b.productId ? 1 : -1;
    });
  });

  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setisLoading(true);
    await dispatch(orderAction.addOrder(cartItems, cartTotalAmount));
    setisLoading(false);
  };
  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}> £{cartTotalAmount.toFixed(2)}</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.primary}
            title="Order Now"
            disabled={cartItems.length === 0} // disable if cart items list we created is empyty (at the top)
            onPress={sendOrderHandler}
          />
        )}
      </View>
      <FlatList
        style={styles.background}
        keyExtractor={(item) => item.productId}
        data={cartItems}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() =>
              dispatch(cartActions.removeFromCart(itemData.item.productId))
            }
          />
        )}
      />
    </View>
  );
};

Cart.navigationOptions = {
  headerTitle: "Your Cart",
};
const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: Colors.background,
    flex: 1,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: Colors.primary,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    color: "white",
  },
  amount: {
    color: Colors.primary,
  },
});

export default Cart;
