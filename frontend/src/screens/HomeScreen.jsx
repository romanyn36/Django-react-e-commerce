import React from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { productsListAction } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import Paginator from "../components/Paginator";
import ProductsCarousel from "../components/ProductsCarousel/ProductsCarousel";

function HomeScreen() {
  // get search keyword from the url
  const searchQuery = window.location ? window.location.search : "";
  var keyword = '';
  if (searchQuery) {
    // console.log("searchQuery", searchQuery);
     keyword = searchQuery.split("keyword=")[1].split("&")[0] || "";
  }

  // console.log("searchQuery", searchQuery);
  const dispatch = useDispatch();
  // 2// now we select the product state to get the data
  const products_List = useSelector((state) => state.productsList);
  // 3 //get the result of each state based on the action// result we get it from ProductListReducers
  const { loading, products, error, pages, page } = products_List;


  useEffect(() => {
    //  1 // make action to update products state
    dispatch(productsListAction(searchQuery));
  }, [dispatch, searchQuery]);

  return (
    <div>
   
      {loading ? <Loader></Loader> :
        error ? <Message variant='danger'> {error}</Message>
          : products && products.length === 0 ? <Message variant='info'>No Products Found</Message> :
          <div>
            {/* if keyword empty and null then show carousel */}
            Top Rated Products
            {!searchQuery && <ProductsCarousel />}
            
            <Row>
              {/* {console.log("products", products)}
              {console.log("error", error)}
              {console.log("length", products.length)} */}

              {products && products.length > 0 && products.map((productitem) => (
                <Col key={productitem.id} sm={12} md={6} lg={4} xl={3}>

                  <Product product={productitem} />
                </Col>
                
              ))}
            </Row>
            <Paginator pages={pages} page={page} keyword={keyword} />
          </div>

      }
    </div>
  );
}

export default HomeScreen;
