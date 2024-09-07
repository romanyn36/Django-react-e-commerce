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
              navbarScroll>
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
             
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
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
                <LinkContainer to="login/">

                  <Nav.Link>
                    <i class="fa fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
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

            </Nav>
            <SearchBox />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      z
    </header>
  );
}

export default Haeder;
