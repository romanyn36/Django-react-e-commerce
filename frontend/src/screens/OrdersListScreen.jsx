import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUserAction, userListAction } from '../actions/UserActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Alert, Button, ButtonGroup, Table } from 'react-bootstrap'
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


    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login?redirect=admin/users')
        }
        else {
            dispatch(allOrdersAction())
        }


    }, [dispatch, navigate, userInfo, successDelete])

    const deleteHandler = (id) => {
        dispatch(deleteUserAction(id))

    }
    return (
        <div>  {errorDelete && <Alert variant='danger'>{errorDelete}</Alert>
        }
            <h1>Orders</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='table-sm'>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(orders => (
                            <tr key={orders.id}>
                                <td>{orders.id}</td>
                                <td>{orders.user.name}</td>
                                <td>{orders.createdAt.substring(0, 10)}</td>
                                <td>${orders.totalPrice}</td>
                                <td>{orders.isPaid ? orders.paidAt.substring(0, 10) : (
                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                )}</td>
                                <td>{orders.isDelivered ? orders.deliveredAt.substring(0, 10) : (
                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                )}</td>
                                <td>
                                    <Link to={`/order/${orders.id}/`}>
                                        <Button className='btn btn-sm'
                                            variant='light'
                                        >
                                            <i className='fas fa-edit'></i>
                                            Details
                                        </Button>
                                    </Link>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>

    )
}

export default OrdersListScreen