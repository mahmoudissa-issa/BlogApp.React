import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@example.com";
  };

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page not found</h2>
        <p className="notfound-message">
          Please check the URL in the address bar and try again.
        </p>
        <div className="notfound-actions">
          <button onClick={handleGoHome} className="btn-go-home">
            Go back home
          </button>
          <button onClick={handleContactSupport} className="btn-contact">
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;