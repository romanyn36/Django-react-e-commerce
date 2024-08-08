import React from 'react'
import { Col, Container } from 'react-bootstrap'

function FormContainer({ children }) {
    return (
        // make width 50% of the screen in large screens and 100% in small screens
        <Container className='bg-light p-2 justify-content-md-center ' style={{maxWidth:'600px'}}>
            <Col xs={12} md={6} >
                {children}
            </Col>
        </Container>
    )
}

export default FormContainer