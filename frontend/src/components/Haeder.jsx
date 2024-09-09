import React, { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { userLogoutAction } from "../actions/UserActions";
import SearchBox from "./SearchBox";
import AlertModal from "./AertModal";

function Haeder() {
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  useEffect(() => {
    // console.log("userInfo from header", userInfo);
  }, [userInfo]);

  const logoutHandler = () => {
    dispatch(userLogoutAction());
  };
  return (
    <header>
      <Navbar expand="lg" className="bg-dark p-2" variant="dark" collapseOnSelect>
        <Container fluid>
          <LinkContainer to="/">
            <Navbar.Brand>
              {/* <img
                src="logo192.png"
                alt="logo"
                width="30"
                height="30"
                className="d-inline-block align-top"
              /> */}
              <i class="fa fa-shopping-cart"></i> Django Shopping
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}

            >
              <LinkContainer to="/">
                <Nav.Link href="/">
                  <i class="fa fa-home"></i> Home
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="cart/">
                <Nav.Link>
                  <i class="fa fa-cart-shopping"></i> Cart
                </Nav.Link>
              </LinkContainer>


            </Nav>
            <div className="d-flex justify-content-center align-items-center mt-5 mt-md-0 text-white">
              {userInfo ? (
                <NavDropdown className="d-none d-md-block" title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <AlertModal customebutton={<NavDropdown.Item>Logout</NavDropdown.Item>}
                    myaction={logoutHandler}
                    title="Logout" message="Are you sure you want to logout?"
                    savetitle="Logout"
                    variant="danger"
                  >

                  </AlertModal>
                </NavDropdown>
              ) : (
                <dev className="d-flex justify-content-between align-items-center " style={{ minWidth: '150px' }}>
                  <LinkContainer to="/register">
                    <Nav.Link className="text-white" >
                      Sign Up
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to="/login">
                    <Button
                      className="btn bg-white text-dark rounded-pill fw-bold"
                    >Sign In</Button>
                  </LinkContainer>
                </dev>
              )}


              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

            </div>

          </Navbar.Collapse>
        </Container>
      </Navbar>

    </header>
  );
}

export default Haeder;
