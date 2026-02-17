import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import '../../styles/Settings.css';

function Settings() {
  const location = useLocation();
  
  // Determine the current section title based on the route
  const getSectionTitle = () => {
    if (location.pathname.includes('/settings/password')) {
      return 'Password';
    } else if (location.pathname.includes('/settings/profile')) {
      return 'Profile';
    }
    return 'Settings';
  };

  return (
    <div className="settings-page">
      <div className="settings-blue-header">
        <Container>
          <h1 className="settings-page-title">{getSectionTitle()}</h1>
        </Container>
      </div>
      <Container className="py-4">
        <div className="settings-container">
          <div className="settings-sidebar">
            <nav className="settings-nav">
              <NavLink 
                to="/settings/profile" 
                className={({ isActive }) => `settings-nav-link ${isActive ? 'active' : ''}`}
              >
                <FaUserCircle className="me-2" />
                Profile
              </NavLink>
              <NavLink 
                to="/settings/password" 
                className={({ isActive }) => `settings-nav-link ${isActive ? 'active' : ''}`}
              >
                <FaLock className="me-2" />
                Password
              </NavLink>
            </nav>
          </div>

          <div className="settings-content">
            <Outlet />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Settings;