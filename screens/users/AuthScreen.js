import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import * as authAction from "../../store/actions/authA";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/input";
import Colors from "../../constant/Colors";

const FORM_UPDATE = "FORM_UPDATE"; // Will check of this action
const formReducer = (state, action) => {
  if (action.type === "FORM_UPDATE") {
    const updatedValues = {
      ...state.inputValue,
      [action.input]: action.value,
    };
    const updatedValidations = {
      ...state.inputValidations,
      [action.input]: action.isValid,
    };
    let formIsValid = true;
    for (const key in updatedValidations) {
      formIsValid = formIsValid && updatedValidations[key];
    }
    return {
      formIsValid: formIsValid,
      inputValidations: updatedValidations,
      inputValue: updatedValues,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [IsLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState();
  const [isSignup, setisSignup] = useState(false);
  const dispatch = useDispatch();

  const [state, dispatchFormState] = useReducer(formReducer, {
    inputValue: {
      email: "",
      password: "",
    }, //initial values
    inputValidations: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier, // the key that links to reducer
      });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authAction.signup(
        state.inputValue.email,
        state.inputValue.password
      );
    } else {
      action = authAction.login(
        state.inputValue.email,
        state.inputValue.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Error) {
      Alert.alert("An Error Occurred", Error, { text: "Okay" });
    }
  }, [Error]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient
        colors={[Colors.background, Colors.background]}
        style={styles.gradient}
      >
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-mail"
              keyboradType="email-address"
              required
              autoCapitalize="none"
              onInputChange={inputChangeHandler}
              errorText="Please enter a vaild email address"
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboradType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a vaild Password"
              onInputChange={inputChangeHandler}
              initialValue=""
            />

            {IsLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Button
                title={isSignup ? "Sign Up" : "Login"}
                color={Colors.primary}
                onPress={authHandler}
              />
            )}
            <Button
              title={`Switch to Sign ${isSignup ? "Login" : "Signup"}`}
              color={Colors.second}
              onPress={() => {
                setisSignup((prevState) => !prevState);
              }} // get old state and change it to oppsite
            />
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = () => {
  return {
    headerTitle: "Login",
  };
};

export default AuthScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 500,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
