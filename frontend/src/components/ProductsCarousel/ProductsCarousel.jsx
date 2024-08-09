import React, { useEffect } from 'react'
import Loader from '../Loader';
import Message from '../Message';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel, Image } from 'react-bootstrap';
import { topRatedProductsAction } from '../../actions/productActions';
import { Link } from 'react-router-dom';
import './ProductsCarousel.css';

function ProductsCarousel() {
    const dispatch = useDispatch();
    // top rated products
    const products_Top = useSelector((state) => state.topRatedProducts);
    const { loading: loadingTop, products: productsTop, error: errorTop } = products_Top;

    useEffect(() => {
        // make action to update products state
        dispatch(topRatedProductsAction());
    }, [dispatch]);

    return (
        <div style={{}}>
            {loadingTop ? <Loader /> : errorTop ? <Message variant='danger'>{errorTop}</Message> : productsTop && productsTop.length === 0 ? null :
                (
                    <Carousel pause='hover' className='bg-dark'>
                        {productsTop && productsTop.map((product) => (
                            <Carousel.Item key={product.id}>
                                <Link to={`/product/${product.id}`}>
                                    <Image src={product.image} alt={product.name} fluid style={{ width: '100%', height: '100%' }} />
                                    <Carousel.Caption className='carousel-caption'>
                                        <h4>{product.name} ({product.price})</h4>
                                    </Carousel.Caption>
                                </Link>


                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
        </div>
    )
}

export default ProductsCarousel