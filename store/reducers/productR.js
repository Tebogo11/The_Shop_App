//Data import
import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/product";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT,
} from "../actions/productA";

const initalState = {
  availableProducts: [], //all products
  userProducts: [], // PRODUCTS.filter((product) => product.ownerId === "u1"), //users selected products
};

export default (state = initalState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case CREATE_PRODUCT:
      const prodData = action.productData;
      const newProduct = new Product(
        prodData.id,
        prodData.ownerId,
        prodData.title,
        prodData.imageUrl,
        prodData.description,
        prodData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct), // old state plus new data
        userProducts: state.userProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );
      const updatedUserProdcuts = [...state.userProducts];
      updatedUserProdcuts[productIndex] = updatedProduct;
      const availableProductsIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedAvaibleProducts = [...state.availableProducts];
      updatedAvaibleProducts[availableProductsIndex] = updatedProduct;
      return {
        ...state,
        availableProducts: updatedAvaibleProducts,
        userProducts: updatedUserProdcuts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ), //Keep all proudcts where the ID is not the same
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
  }
  return state;
};
