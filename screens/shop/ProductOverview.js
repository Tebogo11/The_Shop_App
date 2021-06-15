import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Button,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
//this will allow us to tap in to the redux store
import { useSelector, useDispatch, useStore } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import * as cartAction from "../../store/actions/cartA";
import * as productActions from "../../store/actions/productA";
//Import Componet for FlatList render style
import ProductItem from "../../components/shop/ProductItem";

//Import HeaderButton
import HeaderButton from "../../components/UI/HeaderButton";
import Color from "../../constant/Colors";
import UserProduct from "../users/UserProduct";
import { Colors } from "react-native/Libraries/NewAppScreen";

const ProductOverview = (props) => {
  const [isLoading, setisLoading] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);
  const products = useSelector((state) => state.Products.availableProducts); // accessing the redux data as state
  const dispatch = useDispatch();
  const [Error, setError] = useState();

  const loadProducts = useCallback(async () => {
    console.log("loadporducts action");
    setisRefreshing(true);
    setError(null);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setisRefreshing(false);
  }, [dispatch, setisLoading, setError]);

  useEffect(() => {
    setisLoading(true);
    loadProducts().then(() => {
      setisLoading(false);
    });
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts()
    );
    return willFocusSub.remove();
  }, [loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  //Displaying the error
  //throwin from fetchPorducts(in PorductsA)
  if (Error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred</Text>
        <Button title="Try again" onPress={loadProducts} />
      </View>
    );
  }

  if (isLoading) {
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Color.primary} />
    </View>; // Loading bar
  }

  if (!isLoading && products.length === 0) {
    return (
      <View>
        <Text style={styles.error}>
          No products found. maybe start adding some
        </Text>
      </View>
    );
  }
  return (
    <FlatList
      refreshControl={
        <RefreshControl
          onRefresh={loadProducts}
          refreshing={isRefreshing}
          tintColor="yellow"
        />
      }
      style={styles.screen}
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Color.second}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Color.primary}
            title="Add To Card"
            onPress={() => dispatch(cartAction.addToCart(itemData.item))}
          />
        </ProductItem>
      )} //rendering style
    />
  ); // dont need to set id as react-native recognise id element of each product
};

ProductOverview.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products", //Set this to see header
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }} // Add the cart headerbutton and allow us to nav to it
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName="ios-cart"
          onPress={() => {
            navData.navigation.navigate("Cart");
          }} // Add the cart headerbutton and allow us to nav to it
        />
      </HeaderButtons>
    ),
  };
};

export default ProductOverview;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Color.background,
    color: Colors.primary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
