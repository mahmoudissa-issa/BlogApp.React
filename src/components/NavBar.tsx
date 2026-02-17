// src/components/NavBar.tsx
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import logo from "../assets/m-logo-design.svg";
import { FaChartLine, FaCog, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import "../styles/Navbar.css"
import { SERVER_URL } from "../constants/app";
import { useState } from "react";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, avatarUrl }) => {
  const [imageError, setImageError] = useState(false);

  const initials = username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase();

  if (!avatarUrl || imageError) {
    return (
      <div className="user-avatar-fallback">
        {initials}
      </div>
    );
  }

  return (
    <div className="user-avatar">
      <img
        src={`${SERVER_URL}${avatarUrl}`}
        alt={`${username}'s avatar`}
        className="user-avatar-img"
        onError={() => setImageError(true)}
      />
    </div>
  );
};



export default function NavBar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
            <img src={logo} alt="logo" width="32" 
            loading="lazy"
            height="32" />
          </div>
          <span className="brand-text">FullStack Blog</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="navbar-toggler-custom" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-3">
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
                {/* Desktop Dropdown */}
                <Dropdown className="user-dropdown d-none d-lg-flex" align="end">
                  <Dropdown.Toggle 
                    as="div" 
                    className="user-dropdown-toggle"
                    id="user-dropdown"
                  >
                    <UserAvatar username={user.username} avatarUrl={user.avatarUrl} />
                    <div className="user-info">
                      <div className="user-name">{user.username}</div>
                      <div className="user-role">{user.role}<span style={{ marginLeft: '4px', display: 'inline-flex', alignItems: 'center' }}> <FaChevronDown size={10}  /></span> </div>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    {(user.role === "Admin" || user.role === "Author") && (
                      <>
                        <Dropdown.Item 
                          as={Link} 
                          to="/admin"
                          className="dropdown-item-custom"
                        >
                          <FaChartLine className="dropdown-icon" />
                          <span>Dashboard</span>
                        </Dropdown.Item>
                      </>
                    )}
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/settings"
                      className="dropdown-item-custom"
                    >
                      <FaCog className="dropdown-icon" />
                      <span>Settings</span>
                    </Dropdown.Item>

                    <Dropdown.Divider className="dropdown-divider-custom" />

                    <Dropdown.Item 
                      onClick={handleLogout}
                      className="dropdown-item-custom logout-item"
                    >
                      <FaSignOutAlt className="dropdown-icon" />
                      <span>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* Mobile Menu Items */}
                <div className="d-lg-none w-100">
                  {(user.role === "Admin" || user.role === "Author") && (
                    <Link 
                      to="/admin" 
                      className="nav-link mobile-menu-item"
                    >
                      <FaChartLine className="dropdown-icon" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  
                  <Link 
                    to="/settings" 
                    className="nav-link mobile-menu-item"
                  >
                    <FaCog className="dropdown-icon" />
                    <span>Settings</span>
                  </Link>

                  <hr className="dropdown-divider-custom" />

                  <button 
                    onClick={handleLogout}
                    className="nav-link mobile-menu-item logout-item"
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}