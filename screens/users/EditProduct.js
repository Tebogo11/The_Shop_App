import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  VirtualizedList,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import Input from "../../components/UI/input";

import * as productActions from "../../store/actions/productA";

import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constant/Colors";

// build react reducer for state thats similar - built outside so its not constantly called

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
  return;
};

const EditProduct = (props) => {
  //For error handling
  const [isLoading, setisLoading] = useState(false);
  const [Error, setError] = useState();

  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector(
    (state) => state.Products.userProducts.find((prod) => prod.id === prodId) // find the product with that ID
  );

  //This sets the value with inputValue and checks if its being set or not
  const [state, dispatchFormState] = useReducer(formReducer, {
    inputValue: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    }, //initial values
    inputValidations: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  useEffect(() => {
    if (Error) {
      Alert.alert("Something want wrong", Error, [{ text: "Okay" }]);
    }
  }, [Error]);

  const inputValue = state.inputValue;

  //This has being replaced by useReducer
  // const [title, setTitle] = useState(editedProduct ? editedProduct.title : "");
  // const [titleVaild, settitleVaild] = useState(false);
  // const [imageUrl, setImageUrl] = useState(
  //   editedProduct ? editedProduct.imageUrl : ""
  // );
  // const [price, setPrice] = useState("");
  // const [description, setDescription] = useState(
  //   editedProduct ? editedProduct.description : ""
  // );

  const dispatch = useDispatch();
  // if you can find the variable then display otherwise display nothing
  const submitHandler = useCallback(async () => {
    if (!state.formIsValid) {
      Alert.alert("Wrong input!", "Please check for erros");
      return;
    }

    setError(null);
    setisLoading(true);

    try {
      if (editedProduct) {
        await dispatch(
          productActions.updateProduct(
            prodId,
            inputValue.title,
            inputValue.description,
            inputValue.imageUrl
          )
        );
      } else {
        await dispatch(
          productActions.createProduct(
            inputValue.title,
            inputValue.description,
            inputValue.imageUrl,
            +inputValue.price
          ) // price needs to be convert to a numerical
        );
      }
      console.log("Submitting!");
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setisLoading(false);
  }, [dispatch, prodId, state]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  //Vaildation
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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={100}
      style={styles.background}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct} //passes false if not edited values
            required
          />
          <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
            required
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProduct.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    color: Colors.primary,
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    color: Colors.second,
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  error: {
    color: "red",
  },
  centered: {
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProduct;
