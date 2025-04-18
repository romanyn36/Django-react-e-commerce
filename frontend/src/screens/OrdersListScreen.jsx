import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUserAction, userListAction } from '../actions/UserActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Alert, Button, ButtonGroup, Table, Row, Col, Form, Card, InputGroup, Badge, Pagination } from 'react-bootstrap'
import AlertModal from '../components/AertModal'
import { allOrdersAction } from '../actions/OrderActions'

function OrdersListScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.userLogin.userInfo)
    const allOrders = useSelector(state => state.allOrders)
    const { loading, error, orders } = allOrders
    // delete user
    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete, error: errorDelete } = userDelete

    // Search and pagination states
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [ordersPerPage] = useState(10)

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login?redirect=admin/users')
        }
        else {
            dispatch(allOrdersAction())
        }
    }, [dispatch, navigate, userInfo, successDelete])

    // Filter orders based on search term
    const filteredOrders = orders ? orders.filter(order => 
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.id.toString().includes(searchTerm)
    ) : []

    // Get current orders for pagination
    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

    // Calculate total pages for pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
    
    // Generate pagination items
    let paginationItems = []
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>
        )
    }

    return (
        <div>
            {errorDelete && <Alert variant='danger'>{errorDelete}</Alert>}
            
            {/* Breadcrumb Navigation */}
            <Row className="mb-3">
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/admin">Admin</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Orders</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <Row>
                        <Col><h3><i className="fas fa-shopping-cart me-2"></i> Orders Management</h3></Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3 align-items-center">
                        <Col md={6}>
                            <h5>Total Orders: <Badge bg="secondary">{filteredOrders.length}</Badge></h5>
                        </Col>
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by customer name or order ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    
                    {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                        <>
                            <div className="table-responsive">
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead className="bg-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>CUSTOMER</th>
                                            <th>DATE</th>
                                            <th>TOTAL</th>
                                            <th>PAYMENT STATUS</th>
                                            <th>DELIVERY STATUS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrders && currentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{order.user.name}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="fw-bold">${order.totalPrice}</td>
                                                <td>
                                                    {order.isPaid ? (
                                                        <Badge bg="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Badge>
                                                    ) : (
                                                        <Badge bg="danger">Not Paid</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    {order.isDelivered ? (
                                                        <Badge bg="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Badge>
                                                    ) : (
                                                        <Badge bg="warning" text="dark">Pending</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <Link to={`/order/${order.id}/`}>
                                                        <Button className='btn-sm me-2' variant='outline-primary'>
                                                            <i className='fas fa-eye'></i> View
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-3">
                                    <Pagination>
                                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                                        {paginationItems}
                                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default OrdersListScreen