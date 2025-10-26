// src/components/NavBar.jsx
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import logo from "../assets/m-logo-design.svg";
export default function NavBar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <Navbar
      bg="info"
      variant="light"
      expand="lg"             // <-- correct expand prop
      fixed="top"
      className="shadow-sm nav-container"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white fw-bold text-uppercase d-flex align-items-center">
          <img
            src={logo}
            alt="logo"
            width="48"
            height="48"
            
            className="d-inline-block align-top me-2 "
          />
          Mimo Blog App
        </Navbar.Brand>

        {/* Toggle must reference the same id as Collapse's aria-controls */}
        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            {!user && (
              <>
                <Link to="/login" className="btn btn-light btn-sm me-2">
                  Sign In
                </Link>
                 <Link to="/Register" className="btn btn-light btn-sm me-2">
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                {user.role === "Admin" && (
                  <Nav.Link as={Link} to="/admin" className="text-white me-2">
                    Admin
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/profile" className="text-white me-2">
                  Settings
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
