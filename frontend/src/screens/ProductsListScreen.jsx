import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUserAction, userListAction } from '../actions/UserActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Alert, Button, ButtonGroup, Col, Row, Table } from 'react-bootstrap'
import AlertModal from '../components/AertModal'
import { deleteProductAction, productsListAction } from '../actions/productActions'

function ProductsListScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.userLogin.userInfo)
    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList
    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login?redirect=admin/users')
        }
        else {
            dispatch(productsListAction())
        }


    }, [dispatch, navigate, userInfo])

    const deleteHandler = (id) => {
        dispatch(deleteProductAction(id))

    }

    return (
        <div>
            {errorDelete && <Alert variant='danger'>{errorDelete}</Alert>       }

            <Row className='align-items-center'>
                <Col >
                    <h1>Proucts</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={() => navigate('/admin/products/add')}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>


                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Table striped bordered hover responsive className='table-sm'>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        ${product.price} 
                                    </td>
                                    
                                    <td>
                                      {product.category}
                                    </td>
                                    <td>
                                        {product.brand}
                                    </td>
                                    <td>
                                        <Link to={`/admin/products/${product.id}/edit`}>
                                            <Button className='btn btn-sm'
                                                variant='light'
                                            >
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </Link>

                                        <AlertModal
                                            myaction={() => deleteHandler(product.id)}
                                            customebutton={
                                                <Button
                                                    className="btn btn-sm"
                                                    variant="danger"
                                                    onClick={() => deleteHandler(product.id)}
                                                >
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            }

                                            title='Delete Product'
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </div>

    )
}

export default ProductsListScreen