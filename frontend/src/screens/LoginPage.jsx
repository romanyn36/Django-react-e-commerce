import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { userLoginAction } from '../actions/UserActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
function LoginPage() {
    const [password, setPassword] = useState()
    const [email, setEmail] = useState()
    const redirect = window.location.search ?'/' + window.location.search.split('=')[1] : '/'
    const navigate = useNavigate()
    // make action 
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { loading, userInfo, error } = userLogin
    useEffect(() => {
        if (userInfo) {
            // console.log(userInfo)
            // redirect to the home page
            if (redirect) {
                navigate(redirect)
            }
            else {
                navigate('/')
            }

            // console.log(redirect)
        }
        if (error) {
            console.log(error)
        }

    }, [userInfo]

    )
    const submitHandler = (e) => {
        e.preventDefault()
        // console.log('submit')
        dispatch(userLoginAction(email, password))
    }
    return (
        <div>
            <FormContainer className='justify-content-center align-items-center h-100'>
                <h1>Sign In</h1>
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader size={50} />}
                <Form onSubmit={submitHandler} className=''>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary'>
                        Sign In
                    </Button>
                </Form>
                < Row className='py-3'>
                    <Col>
                        New Customer?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                            Register
                        </Link>
                    </Col>

                </Row>
            </FormContainer>


        </div>
    )
}
export default LoginPage