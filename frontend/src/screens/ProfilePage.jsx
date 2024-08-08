import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { getUserDetailAction, userUpadateProfileAction } from "../actions/UserActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/UserConstants";
import { MyOrdersAction } from "../actions/OrderActions";
function ProfilePage() {
    const [userData, setUserData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
    const [matchPassword, setMatchPassword] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const userDetail = useSelector((state) => state.userDetail);
    const { loading, error, userDetail: user } = userDetail;
    const userUpadat = useSelector(state => state.UserUpdateProfileReducers);
    const { success } = userUpadat;
    const myOrders = useSelector(state => state.myOrdersReducers);

    const { loading: loadingOrders, error: errorOrders, orders,success:successOrders } = myOrders;
    useEffect(() => {
        if (!userLogin.userInfo) {
            navigate('/login');
        }
        else {
            if (!user || !user.name || success || user.id !== userLogin.userInfo.id) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetailAction('profile'));

            }
            if (user && user.name) {
                setUserData({ name: user.name, username: user.username, email: user.email });
            }
            // load orders
            if (!orders || !successOrders) {
                dispatch(MyOrdersAction());
            }
        }
        // console.log('user', user);
        console.log('orders', orders);

    }
        , [dispatch, navigate, userLogin.userInfo, user, success,successOrders]);
    const submitHandler = (e) => {
        e.preventDefault();
        // make sure the password and the confirm password are the same

        if (validatePassword()) {
            // dispatch the action to update the user profile
            dispatch(userUpadateProfileAction({
                'id': user.id,
                'name': userData.name,
                'username': userData.username,
                'email': userData.email,
                'password': userData.password ? userData.password : ''
            }));

        }
    }
    const handlechange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const validatePassword = () => {
        if (password == confirmPassword) {
            setMatchPassword(true);
            return true;
        } else {
            setMatchPassword(false);
            return false;
        }
    }
    const { name, username, email, password, confirmPassword } = userData;

    return (
        <Container>
            <Row className='justify-content-md-center'>
                <Col md={3}>
                    <h3>User Profile</h3>
                    {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    name='name'
                                    onChange={handlechange}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='username'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type='username'
                                    placeholder='Enter username'
                                    value={username}
                                    name='username'
                                    onChange={handlechange}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    name='email'
                                    onChange={handlechange}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Enter password'
                                    value={password}
                                    name='password'
                                    onChange={handlechange}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='confirmPassword'>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Confirm password'
                                    value={confirmPassword}
                                    name='confirmPassword'
                                    onChange={handlechange}
                                ></Form.Control>
                            </Form.Group>
                            {!matchPassword ? <Message className="mt-5" variant='danger'>
                                Passwords do not match
                            </Message> : ''}
                            <Button type='submit' variant='primary'>Update</Button>
                        </Form>}
                </Col>
                <Col md={9}>
                    <h3 >My Orders</h3>
                    {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}</Message> : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders &&
                                 orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td> {order.createdAt.substring(0, 10)}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}</td>
                                        <td className="">{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )} <Button variant='info' onClick={() => navigate(`/order/${order.id}`)}>Details</Button></td>
                                    </tr>

                                ))}

                            </tbody>

                        </Table>
                    )}


                </Col>
            </Row>
        </Container>
    )
}
export default ProfilePage;
