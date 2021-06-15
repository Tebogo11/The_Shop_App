//Imports
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import ReduxThunk from "redux-thunk";
//Import Navigator
import ShopNavigation from "./navigation/ShopNavigation";
import NavigationCon from "./navigation/NavContainer";
//import reducers
import cartReducer from "./store/reducers/cartR";
import productReducer from "./store/reducers/productR";
import orderReducer from "./store/reducers/orderR";
import authReducer from "./store/reducers/authR";
import authR from "./store/reducers/authR";

// this will allow us to compare all reducers in the App
const rootReducer = combineReducers({
  Products: productReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};
export default function App() {
  const [fontLoaded, setfontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setfontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }
  return (
    // allows us to share data in store
    <Provider store={store}>
      <NavigationCon />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
