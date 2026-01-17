// src/components/Footer.tsx
import { Container } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
  return (
    <Container fluid className="footer-enhanced">
      <div className="footer-content">
        <p className="footer-text">© 2025 FullStack Blog App. MIT Licensed.</p>

        <div className="footer-links">
          <a href="/terms" className="footer-link">
            Terms of Service
          </a>
          <a href="/privacy" className="footer-link">
            Privacy Policy
          </a>
        </div>

        <div className="social-icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Facebook"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Twitter"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </Container>
  );
}

export default Footer;