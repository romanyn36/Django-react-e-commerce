import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SearchBox = () => {
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState('')
    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            // redirect to the search page
            navigate(`/?keyword=${keyword}`)
        }
    }
    return (
        <div>
            <Form onSubmit={onSubmitHandler} className="d-flex">
                <Form.Control
                    inline
                    type='text'
                    name='q'
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder='Search Products...'
                    className="me-2"
                ></Form.Control>
                <Button inline type='submit' variant='outline-success'> Search</Button>
            </Form>
        </div>
    )
}
export default SearchBox