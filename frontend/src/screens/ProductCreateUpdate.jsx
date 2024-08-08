import React from "react";
import { Container, Row, Col, InputGroup } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserDetailAction, updateUserAction } from "../actions/UserActions";
import { UserUpdateReducers } from "../reducers/UserReducers";
import { USER_UPDATE_RESET } from "../constants/UserConstants";
import { PRODUCT_CREATE_OR_UPDATE_RESET, PRODUCT_DELETE_RESET, PRODUCT_DETAILS_RESET } from "../constants/productConstants";
import { createOrUpdateProductAction, productsDetailsAction } from "../actions/productActions";

function ProductCreateUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({ name: '', price: 0, brand: '', description: '', imageUrl: '', category: '', countInStock: 0 });
    const [imageFile, setImageFile] = useState(null);
    const userInfo = useSelector((state) => state.userLogin.userInfo);
    const productDetail = useSelector((state) => state.productDetails);
    const { product: productDetailData, loading: loadingDetail, error: errorDetail } = productDetail;
    const dispatch = useDispatch();
    const productCreateOrUpdate = useSelector((state) => state.productCreateOrUpdate);
    const { loading, error, success } = productCreateOrUpdate;


    useEffect(() => {

        if (!userInfo) {
            navigate('/login=redirect=admin/users');
        }
        if (id) {
            if (!productDetailData || !productDetailData.name || productDetailData.id !== Number(id)) {
                dispatch(productsDetailsAction(id));


            }
            else {
                setProduct({ id: id, name: productDetailData.name, price: productDetailData.price, brand: productDetailData.brand, description: productDetailData.description, imageUrl: productDetailData.image, category: productDetailData.category, countInStock: productDetailData.countInStock });
            }
        }
        if (success) {
            dispatch({ type: PRODUCT_CREATE_OR_UPDATE_RESET });
            dispatch({ type: PRODUCT_DETAILS_RESET });
            navigate('/admin/products');
        }
    }, [navigate, userInfo, productDetailData, id, success]);

    const handlechange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }
    const handlechangeImage = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        // if id is null then create a new product else update the product
        const formData = new FormData();
        formData.append('id', product.id);
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('brand', product.brand);
        formData.append('description', product.description);
        formData.append('category', product.category);
        formData.append('countInStock', product.countInStock);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        // for (let [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        dispatch(createOrUpdateProductAction(formData, id));
    }
    const { name, price, brand, description, imageUrl, category, countInStock } = product;
    // console.log(userdata);
    return (

        <Container>
            <Link to='/admin/products   ' className='btn btn-light my-3'>Go Back</Link>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>{id ? 'Update Product' : 'Create Product'}</h1>
                    {

                        loadingDetail ? <Loader size={50}></Loader> : errorDetail ? <Message variant='danger'> {errorDetail}</Message> :
                            <Form className=' ' style={{}} onSubmit={submitHandler}>
                                {loading ? <Loader size={50}></Loader> : error ? <Message variant='danger'> {error}</Message> : success ? <Message variant='success'>Product Created</Message> : ''}
                                <Row className=''>
                                    <Col md={6}>
                                        <Form.Group controlId='name'>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type='name'
                                                placeholder='Enter product name'
                                                value={name ? name : ''}
                                                name='name'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='price'>
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type='number'
                                                placeholder='Enter product price'
                                                value={price ? price : ''}
                                                name='price'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='brand'>
                                            <Form.Label>Brand</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter product brand'
                                                value={brand ? brand : ''}
                                                name='brand'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='description'>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter product description'
                                                value={description ? description : ''}
                                                name='description'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        
                                        {/* image file and label group */}
                                        <Form.Group controlId='image'>
                                            <Form.Label>Image</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter product image'
                                                value={imageUrl ? imageUrl : ''}
                                                name='image'
                                                disabled
                                                onChange={handlechange}
                                            ></Form.Control>


                                        </Form.Group>
                                        <InputGroup className="mb-3">
                                            <div class="input-group mb-3">
                                                <input type="file" class="form-control" id="inputGroupFile02" onChange={handlechangeImage} />
                                                <label class="input-group-text" for="inputGroupFile02">Upload</label>
                                            </div>

                                        </InputGroup>
                                        {/* count ins tock */}
                                        <Form.Group controlId='countInStock'>
                                            <Form.Label>Count In Stock</Form.Label>
                                            <Form.Control
                                                type='number'
                                                placeholder='Enter product count in stock'
                                                value={countInStock ? countInStock : ''}
                                                name='countInStock'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId='category'>
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter product category'
                                                value={category ? category : ''}
                                                name='category'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>

                                    </Col> <Button className="mt-3" type='submit' variant='primary'>{id ? 'Update Product' : 'Create Product'} </Button>
                                </Row>




                            </Form>
                    }

                </Col>
            </Row>

        </Container>
    )
}

export default ProductCreateUpdate;