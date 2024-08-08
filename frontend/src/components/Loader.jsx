import Spinner from 'react-bootstrap/Spinner';

function Loader({size=100}) {
    return (
        <div>
            <Spinner animation="border" variant="primary" role='status'
            className='d-block m-auto'
            style={{height:`${size}px`,
                width:`${size}px`
            }}
            >
                <span className='sr-only'>Loading...</span>
            </Spinner>

            {/* <Spinner animation="grow" variant="dark" /> */}
        </div>
    );
}

export default Loader;