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
    const [imagePreview, setImagePreview] = useState(null);
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
                setImagePreview(productDetailData.image);
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
        
        // Create preview URL for the selected image
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
        }
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

        dispatch(createOrUpdateProductAction(formData, id));
    }
    const { name, price, brand, description, imageUrl, category, countInStock } = product;
    return (

        <Container>
            <Link to='/admin/products' className='btn btn-light my-3'>Go Back</Link>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={8}>
                    <h1>{id ? 'Update Product' : 'Create Product'}</h1>
                    {

                        loadingDetail ? <Loader size={50}></Loader> : errorDetail ? <Message variant='danger'> {errorDetail}</Message> :
                            <Form className='p-3 border rounded shadow-sm' onSubmit={submitHandler}>
                                {loading ? <Loader size={50}></Loader> : error ? <Message variant='danger'> {error}</Message> : success ? <Message variant='success'>Product Created</Message> : ''}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId='name' className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type='name'
                                                placeholder='Enter product name'
                                                value={name ? name : ''}
                                                name='name'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='price' className="mb-3">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type='number'
                                                placeholder='Enter product price'
                                                value={price ? price : ''}
                                                name='price'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='brand' className="mb-3">
                                            <Form.Label>Brand</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter product brand'
                                                value={brand ? brand : ''}
                                                name='brand'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='description' className="mb-3">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                rows={3}
                                                placeholder='Enter product description'
                                                value={description ? description : ''}
                                                name='description'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        {/* Image preview */}
                                        <div className="mb-3 text-center">
                                            {imagePreview && (
                                                <div>
                                                    <p className="mb-2">Image Preview:</p>
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Product Preview" 
                                                        style={{ maxHeight: '200px', maxWidth: '100%' }} 
                                                        className="border rounded mb-3"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* image file and label group */}
                                        <Form.Group controlId='image' className="mb-3">
                                            <Form.Label>Current Image</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Product image path'
                                                value={imageUrl ? imageUrl : ''}
                                                name='imageUrl'
                                                disabled
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                        
                                        <InputGroup className="mb-3">
                                            <div className="input-group mb-3">
                                                <input 
                                                    type="file" 
                                                    className="form-control" 
                                                    id="inputGroupFile02" 
                                                    onChange={handlechangeImage}
                                                    accept="image/*"
                                                />
                                                <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                                            </div>
                                        </InputGroup>
                                        
                                        {/* count in stock */}
                                        <Form.Group controlId='countInStock' className="mb-3">
                                            <Form.Label>Count In Stock</Form.Label>
                                            <Form.Control
                                                type='number'
                                                placeholder='Enter product count in stock'
                                                value={countInStock ? countInStock : ''}
                                                name='countInStock'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId='category' className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter product category'
                                                value={category ? category : ''}
                                                name='category'
                                                onChange={handlechange}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col> 
                                </Row>
                                
                                <div className="text-center">
                                    <Button className="mt-3 px-4" type='submit' variant='primary' size="md">
                                        {id ? 'Update Product' : 'Create Product'}
                                    </Button>
                                </div>
                            </Form>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default ProductCreateUpdate;