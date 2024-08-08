import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from 'react-redux'
import { createReviewAction, productsDetailsAction } from '../actions/productActions'
import { addToCartAction } from '../actions/CartActions'
import { PRODUCT_CREATE_OR_UPDATE_RESET, PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'


function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  // select the state
  // useSelector is a hook that takes the current state as an argument and returns whatever data you need from it.
  // we use it when we want to access the state in the component
  // but if we want select the state in the action we use getState
  const product_details = useSelector((state) => state.productDetails)
  const [rating, setRating] = useState({ rating: 0, comment: '' })
  // user login
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  // create review
  const createReview = useSelector((state) => state.createReview)
  const { success: successReview, error: errorReview, loading: loadingReview } = createReview



  // get product
  const { loading, product, error } = product_details

  useEffect(() => {
    // 1// make action to update
    dispatch(productsDetailsAction(id))
    // reset the rating
    if (successReview) {
      setRating({ rating: 0, comment: '' })
      // refresh the page
      dispatch(productsDetailsAction(id))
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [dispatch, id, successReview])
  const checkoutHandler = () => {
    navigate(`/cart/${id}?quantity=${quantity}`)
  }
  const addToCartHandler = () => {
    // console.log("add to cart")  
    dispatch(addToCartAction(id, Number(quantity)))
  }
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createReviewAction(id, rating))
  }

  return (
    // find the product with the id

    <div>
      <Link to="/" className="btn btn-light my-3">Go Back</Link>
      {loading ? <Loader></Loader> :
        error ? <Message variant='danger'> {error}</Message>
          :
          <div>
            <Row>
              <Col md={5}>
                <Image src={product.image} alt={product.name} fluid style={{ maxHeight: "350px" }} />
              </Col>
              <Col md={4}>
                <ListGroup variant="flush">

                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price: ${product.price}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col><strong>${product.price}</strong></Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.countInStock > 0 ? <span style={{ color: '#07df61', fontWeight: "bold" }}>In Stock</span> : <span style={{ color: 'red', fontWeight: "bold" }}>Out of Stock</span>}</Col>
                    </Row>
                  </ListGroup.Item>
                  {/* set quantity */}
                  {product.countInStock > 0 && (<ListGroup.Item>
                    <Row>
                      <Col>Quantity</Col>
                      <Col>
                        <Form.Control as="select" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                          {product.countInStock > 10 ? [...Array(10).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                          )) :
                            [...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>{x + 1}</option>
                            ))

                          }
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>)

                  }

                  <ListGroup.Item>
                    <Button className="btn p-2" type="button" disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>

                    <Button className="btn ms-1 p-2" type="button" disabled={product.countInStock === 0}
                      onClick={checkoutHandler}
                    >
                      checkout now
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            {/* reviws row */}
            <Row>
              <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant='flush'>
                  {product.reviews.map(review => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {errorReview && <Message variant='danger'>{errorReview}</Message>}
                    {successReview && <Message variant='success'>Review submitted successfully</Message>}
                    {userInfo ? (
                      <Form>
                        <Form.Group controlId='rating'>
                          <Form.Label>Rating</Form.Label>
                          <Form.Control as='select' value={rating.rating} onChange={(e) => setRating({ ...rating, rating: e.target.value })}>
                            <option value='0'>Select...</option>
                            <option value='1'>1 - Poor</option>
                            <option value='2'>2 - Fair</option>
                            <option value='3'>3 - Good</option>
                            <option value='4'>4 - Very Good</option>
                            <option value='5'>5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='comment'>
                          <Form.Label>Comment</Form.Label>
                          <Form.Control as='textarea' row='5' value={rating.comment} onChange={(e) => setRating({ ...rating, comment: e.target.value })}></Form.Control>
                        </Form.Group>
                        <Button type='button'
                        className='my-3'
                          disabled={rating.rating === 0 || loadingReview}
                          onClick={submitHandler}>Submit</Button>
                      </Form>
                    ) : <Message>Please <Link to='/login'>sign in</Link> to write a review</Message>}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </div>
      }
    </div>
  )
}

export default ProductPage