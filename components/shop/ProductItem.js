import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

//Import Colors
import Color from "../../constant/Colors";

//This component is used for a constant Product Listing item
const ProductItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onSelect}>
      <View style={styles.product}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: props.image }} />
        </View>
        <View style={styles.summary}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.price}>£{props.price.toFixed(2)}</Text>
        </View>
        <View style={styles.buttons}>{props.children}</View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  product: {
    shadowColor: Color.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: Color.background,
    height: 300,
    margin: 20,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: "25%",
  },
  title: {
    fontSize: 20,
    marginVertical: 4,
    color: Color.primary,
  },
  price: {
    fontSize: 18,
    color: Color.second,
    marginVertical: 4,
  },
  summary: {
    justifyContent: "center",
    alignItems: "center",
    height: "16%",
  },
});
