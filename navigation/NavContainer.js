import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ShopNavigation from "./ShopNavigation";

import { NavigationActions } from "react-navigation";

//This is so i can check that user has logout
//Cant do it in App.js
const NavContainer = () => {
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.auth.token);

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
        // navigate to auth even though its outside the navigator
      );
    }
  }, [isAuth]);
  return <ShopNavigation ref={navRef} />;
};

export default NavContainer;
