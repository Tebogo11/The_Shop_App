import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
//used to access redux data
import * as cartAction from "../../store/actions/cartA";
//Import Color
import Colors from "../../constant/Colors";

ProductDetail = (props) => {
  const productId = props.navigation.getParam("productId"); // Get ID from the last screen
  const dispatch = useDispatch(); //Allows us to add items to redux
  //Use Id to filter out the product we need
  const selectedproduct = useSelector((state) =>
    state.Products.availableProducts.find((prod) => prod.id === productId)
  ); // accessing the redux data as state

  return (
    // Scrolling through a page length you can predict
    <ScrollView style={styles.screen}>
      <Image style={styles.image} source={{ uri: selectedproduct.imageUrl }} />
      <Button
        title="Add To Cart"
        color={Colors.primary}
        onPress={() => dispatch(cartAction.addToCart(selectedproduct))}
      />
      <Text style={styles.price}>£{selectedproduct.price}</Text>
      <Text style={styles.description}>{selectedproduct.description}</Text>
    </ScrollView>
  );
};

ProductDetail.navigationOptions = (navigationData) => {
  return {
    headerTitle: navigationData.navigation.getParam("productTitle"),
  }; //Set this to see header
};

export default ProductDetail;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.background,
  },
  price: {
    color: Colors.second,
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
  },
  description: {
    color: Colors.second,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 250,
  },
});
