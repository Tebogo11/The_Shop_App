import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    //any async code you want
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://the-shop-app-71907-default-rtdb.firebaseio.com/products.json"
      );

      // checks for errors
      if (!response.ok) {
        throw new Error("Something want wrong ");
      }
      //Saving data in google firebase
      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (err) {
      // send to custom analystic server
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const reponse = await fetch(
      `https://the-shop-app-71907-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!reponse.ok) {
      throw new Error("Something want wrong");
    }

    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token; //get token from authR
    //any async code you want
    const response = await fetch(
      `https://the-shop-app-71907-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        }),
      }
    );
    //Saving data in google firebase
    const resData = await response.json();
    // retriving the automatic key it creates and using it for new products

    console.log(resData);
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      //We want to point to a speicfic product
      `https://the-shop-app-71907-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH", // UPDATE WHERE I WANT IT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description, // firebase will only change those variables
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something want wrong");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
