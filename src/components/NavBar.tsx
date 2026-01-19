// src/components/NavBar.tsx
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import logo from "../assets/m-logo-design.svg";
import "../styles/Navbar.css"



export default function NavBar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      fixed="top"
      className="navbar-enhanced"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <div className="logo-wrapper">
            <img src={logo} alt="logo" width="32" height="32" />
          </div>
          <span className="brand-text">FullStack Blog</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="navbar-toggler-custom" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">
            {!user && (
              <>
                <Link to="/login" className="nav-btn nav-btn-outline">
                  Sign In
                </Link>
                <Link to="/Register" className="nav-btn nav-btn-outline">
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                {user.role === "Admin" && (
                  <Link to="/admin" className="nav-btn nav-btn-outline">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="nav-btn nav-btn-outline">
                  Settings
                </Link>
                <Link to="/" className="nav-btn nav-btn-outline" onClick={handleLogout}>
                  Logout
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}