import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUserAction, userListAction } from '../actions/UserActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Alert, Button, ButtonGroup, Table } from 'react-bootstrap'
import AlertModal from '../components/AertModal'

function UserListScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.userLogin.userInfo)
    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList
    // delete user
    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete, error: errorDelete } = userDelete


    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login?redirect=admin/users')
        }
        else {
            dispatch(userListAction())
        }
       

    }, [dispatch, navigate, userInfo, successDelete])

    const deleteHandler = (id) => {
        dispatch(deleteUserAction(id))
         
    }
    return (
        <div>UserListScreen  { errorDelete && <Alert variant='danger'>{errorDelete}</Alert>
        }
            <h1>Users</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='table-sm'>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <i className='fas fa-check' style={{ color: 'green' }}></i>
                                    ) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/admin/users/${user.id}/edit`}>
                                        <Button className='btn btn-sm'
                                            variant='light'
                                        >
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </Link>

                                    <AlertModal
                                        myaction={() => deleteHandler(user.id)}
                                        customebutton={
                                            <Button
                                                className="btn btn-sm"
                                                variant="danger"
                                                onClick={() => deleteHandler(user.id)}
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        }

                                        title='Delete User'
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

export default UserListScreen