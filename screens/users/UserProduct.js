import React from "react";
import { StyleSheet, FlatList, Button, View, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ProductItem from "../../components/shop/ProductItem";

import Color from "../../constant/Colors";

//import actions for deletion
import * as productActions from "../../store/actions/productA";

const UserProduct = (props) => {
  const userProduct = useSelector((state) => state.Products.userProducts);
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item? ", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productActions.deleteProduct(id));
        },
      },
    ]);
  };

  return (
    <View style={styles.background}>
      <FlatList
        data={userProduct}
        renderItem={(itemData) => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              props.navigation.navigate("EditProducts", {
                productId: itemData.item.id,
              });
            }}
          >
            <Button
              color={Color.second}
              title="Edit Details"
              onPress={() => {
                props.navigation.navigate("EditProducts", {
                  productId: itemData.item.id,
                });
              }}
            />
            <Button
              color={Color.primary}
              title="Delete"
              onPress={() => {
                deleteHandler(itemData.item.id);
              }}
            />
          </ProductItem>
        )}
      />
    </View>
  );
};

UserProduct.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
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
          title="Add"
          iconName="ios-create"
          onPress={() => {
            navData.navigation.navigate("EditProducts");
          }} // Add the cart headerbutton and allow us to nav to it
        />
      </HeaderButtons>
    ),
  };
};

export default UserProduct;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Color.background,
  },
});
