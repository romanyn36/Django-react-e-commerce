import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { Button, Form, Row, Col, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { userLoginAction } from '../actions/UserActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

function LoginPage() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const redirect = window.location.search ?'/' + window.location.search.split('=')[1] : '/'
    const navigate = useNavigate()
    // make action 
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { loading, userInfo, error } = userLogin
    useEffect(() => {
        if (userInfo) {
            // redirect to the home page
            if (redirect) {
                navigate(redirect)
            }
            else {
                navigate('/')
            }
        }

    }, [userInfo]

    )
    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(userLoginAction(email, password))
    }
    return (
            <FormContainer>
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-4">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Sign In</h2>
                            <p className="text-muted">Access your account</p>
                        </div>
                        
                        {error && <Message variant='danger'>{error}</Message>}
                        {loading && <div className="text-center"><Loader size={50} /></div>}
                        
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="py-2"
                                    required
                                ></Form.Control>
                            </Form.Group>
                            
                            <Form.Group className="mb-4" controlId='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="py-2"
                                    required
                                ></Form.Control>
                            </Form.Group>
                            
                            <Button 
                                type='submit' 
                                variant='primary' 
                                className="w-100 py-2 mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </Form>
                        
                        <div className="text-center mt-3">
                            <p className="mb-0">
                                New Customer?{' '}
                                <Link 
                                    to={redirect ? `/register?redirect=${redirect}` : '/register'}
                                    className="text-primary fw-bold"
                                >
                                    Create an Account
                                </Link>
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            </FormContainer>
    )
}

export default LoginPage