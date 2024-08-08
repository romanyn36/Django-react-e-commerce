import React from "react";
import { Container, Row, Col } from "react-bootstrap";
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

function UserEditScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userdata, setUserData] = useState({ name: '', username: '', email: '', isAdmin: false });
    const userInfo = useSelector((state) => state.userLogin.userInfo);
    const dispatch = useDispatch();
    const userDetail = useSelector((state) => state.userDetail);
    const { loading, error, userDetail: user } = userDetail;
    const userUpdate = useSelector((state) => state.userUpdate);
    const { success } = userUpdate;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }

        console.log('user', user);
        if (!user || user.id !== Number(id)) {
            console.log('dispatching');
            dispatch(getUserDetailAction(id, `/api/users/user/${id}/`));
        }
        else
            setUserData({ name: user.name, username: user.username, email: user.email, isAdmin: user.isAdmin });
        if (success) {
            dispatch({ type: USER_UPDATE_RESET });
        }


    }, [navigate, userInfo, user]);
    const submitHandler = (e) => {
        e.preventDefault();
        // make sure the password and the confirm password are the same
        
        dispatch(updateUserAction(id, userdata));





    }
    const handlechange = (e) => {
        if (e.target.name === 'isAdmin') {
            setUserData({ ...userdata, [e.target.name]: e.target.checked });
            // console.log(e.target.checked);
        }
        else
            setUserData({ ...userdata, [e.target.name]: e.target.value });


    }


    const { name, username, email, isAdmin } = userdata;
    // console.log(userdata);
    return (

        <Container>
            <Link to='/admin/users' className='btn btn-light my-3'>Go Back</Link>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>Edit User</h1>
                    {

                        loading ? <Loader size={50}></Loader> : error ? <Message variant='danger'> {error}</Message> :
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='name'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type='name'
                                        placeholder='Enter name'
                                        value={name ? name : ''}
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

                                <Form.Group controlId='isAdmin'>
                                    <Form.Check
                                        type='checkbox'
                                        label='Is Admin'
                                        checked={isAdmin}
                                        name='isAdmin'
                                        onChange={handlechange}
                                    ></Form.Check>
                                </Form.Group>

                                <Button type='submit' variant='primary'>Update</Button>
                            </Form>
                    }

                </Col>
            </Row>

        </Container>
    )
}
export default UserEditScreen;