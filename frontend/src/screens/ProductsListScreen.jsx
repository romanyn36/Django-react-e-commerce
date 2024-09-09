import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUserAction, userListAction } from '../actions/UserActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Alert, Button, ButtonGroup, Col, Row, Table } from 'react-bootstrap'
import AlertModal from '../components/AertModal'
import { deleteProductAction, productsListAction } from '../actions/productActions'
import Paginator from '../components/Paginator'
import { MEDIA_BASE_URL } from '../constants/urlConfig'
import SearchBox from '../components/SearchBox'

function ProductsListScreen() {
    const searchQuery = window.location.search?window.location.search:''
    const keyword = searchQuery?searchQuery.split('keyword=')[1].split('&')[0]:''
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.userLogin.userInfo)
    const productsList = useSelector(state => state.productsList)
    const { loading, error, products, page, pages } = productsList
    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login?redirect=admin/users')
        }
        else {
            dispatch(productsListAction(searchQuery))
        }


    }, [dispatch, navigate, userInfo, successDelete, searchQuery])

    const deleteHandler = (id) => {
        dispatch(deleteProductAction(id))

    }

    return (
        <div>
        
            {errorDelete && <Alert variant='danger'>{errorDelete}</Alert>}

            <Row className='align-items-center'>
                <Col >
                    <h1>Proucts</h1>
                    <SearchBox />
                </Col>
                
                <Col className='text-end'>
                
                    <Button className='my-3' onClick={() => navigate('/admin/products/add')}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>


            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <div>
                    <Table striped bordered hover responsive className='table-sm'>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>IMAGE</th>
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
                                    <td> <img src={`${MEDIA_BASE_URL}${product.image}`}  alt={product.name} width={50} height={50} /></td>
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
                    <Paginator page={page} pages={pages} isAdmin={true} keyword={keyword} />
                </div>
            )}
        </div>

    )
}

export default ProductsListScreen