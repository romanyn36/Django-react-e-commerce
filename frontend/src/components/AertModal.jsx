import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AlertModal({myaction= () => {}, variant='danger',customebutton  = <Button variant={variant} >Primary</Button>
,title="Are you sure?", message="Are you sure you want to delete this item?",savetitle="Save Changes"}) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        myaction();
    }
    const handleCancel = () => setShow(false);
    const handleShow = () => setShow(true);

    // Clone the button to add the onClick handler
    const buttonWithHandler = React.cloneElement(customebutton, {
        onClick: handleShow
    });

    return (
        <>
            {buttonWithHandler}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message} </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        {savetitle}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AlertModal;