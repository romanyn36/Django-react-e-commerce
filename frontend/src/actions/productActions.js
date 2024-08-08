import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_OR_UPDATE_REQUEST,
  PRODUCT_CREATE_OR_UPDATE_SUCCESS,
  PRODUCT_CREATE_OR_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL
} from "../constants/productConstants";
import axios from "axios";
// here we make a request to the backend to get the products
// if the request is successful we dispatch the action to the reducer
// thats mean we send the action to the reducer to update the state
// if the request is failed we dispatch the action to the reducer to update the state
export const productsListAction = (searchQuery = "") => async (dispatch) => {
  try {
    //   send action to producer in cases success
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const url = "/api/products/" + searchQuery;
    const { data } = await axios.get(url);
    dispatch({ type: PRODUCT_LIST_SUCCESS, playload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      playload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// action for product details
export const productsDetailsAction = (id) => async (dispatch) => {
  try {
    //   send action to producer in cases success// to update the state
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/products/${id}/`)
    // update the state
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, playload: data }); 
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      playload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// delete product action
export const deleteProductAction = (id) => async (dispatch, getState) => {
  try {
    // send action to producer in cases success
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/products/delete/${id}/`, config);
    // update the state
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
    dispatch(productsListAction());
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      playload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
// create or update product action
export const createOrUpdateProductAction = (product,id=null) => async (dispatch, getState) => {
  try {
       for (let [key, value] of product.entries()) {
            console.log(key, value);
        }
    // send action to producer in cases success
    dispatch({ type: PRODUCT_CREATE_OR_UPDATE_REQUEST });
    const { userLogin: { userInfo } } = getState()
    const config = {
      // to make accept the image file
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    if (!id) {
      const { data } = await axios.post(`/api/products/create/`, product, config);
      dispatch({ type: PRODUCT_CREATE_OR_UPDATE_SUCCESS, playload: data });
    } else {
      const { data } = await axios.put(`/api/products/update/${product.get('id')}/`, product, config);
      dispatch({ type: PRODUCT_CREATE_OR_UPDATE_SUCCESS, playload: data });
    }
    dispatch(productsListAction());
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_OR_UPDATE_FAIL,
      playload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
// create review action
export const createReviewAction = (productId, review) => async (dispatch, getState) => {
  try {
    // send action to producer in cases success
    dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.post(`/api/products/${productId}/review/`, review, config);
    // update the state
    dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      playload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
}

// top rated products action
export const topRatedProductsAction = () => async (dispatch) => {
  try {
    //   send action to producer in cases success// to update the state
    dispatch({ type: PRODUCT_TOP_REQUEST });
    const { data } = await axios.get(`/api/products/top/`)
    // update the state
    dispatch({ type: PRODUCT_TOP_SUCCESS, playload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      playload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};