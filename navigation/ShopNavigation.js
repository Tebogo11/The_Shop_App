import { createStackNavigator } from "react-navigation-stack";
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from "react-navigation-drawer";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import React from "react";
//Import Screens
import ProductOverview from "../screens/shop/ProductOverview";
import ProductDetail from "../screens/shop/ProductDetail";
import Cart from "../screens/shop/Cart";
import Orders from "../screens/shop/Order";
import UserProduct from "../screens/users/UserProduct";
import EditProduct from "../screens/users/EditProduct";
import AuthScreen from "../screens/users/AuthScreen";
import StartUpScreen from "../screens/StartupScreen";
//import Colors
import Colors from "../constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Platform, SafeAreaView, Button, View } from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/authA";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor:
      Platform.OS === "android" ? Colors.accent : Colors.background,
  },
  headerTitleStyle: {},
  headerTintColor: Platform.OS === "android" ? Colors.second : Colors.primary, // chnage header based on OS
};

//Stack Navigation - First
const ProductNavigator = createStackNavigator(
  {
    ProductOverview: ProductOverview,
    ProductDetail: ProductDetail,
    Cart: Cart,
  },

  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    }, //used if inside the screen of a another navigator
    defaultNavigationOptions: defaultNavOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Order: Orders,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    }, //used if inside the screen of a another navigator
    defaultNavigationOptions: defaultNavOptions,
  }
);

const adminNavigator = createStackNavigator(
  {
    UserProduct: UserProduct,
    EditProducts: EditProduct,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    }, //used if inside the screen of a another navigator
    defaultNavigationOptions: defaultNavOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductNavigator,
    Orders: OrdersNavigator,
    Admin: adminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
      inactiveTintColor: Colors.second,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
            color: Colors.primary,
          }}
        >
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerNavigatorItems {...props} />
            <Button
              title="LogOut"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                // props.navigation.navigate("Auth");
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigation = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

//Doest allow you to go back
const MainNavigator = createSwitchNavigator({
  StartUp: StartUpScreen,
  Auth: AuthNavigation,
  Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator); //wrap in createAppContainer
