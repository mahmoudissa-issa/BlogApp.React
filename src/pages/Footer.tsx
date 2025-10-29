import React from "react";
import { Container } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";
function Footer() {
  return (
   <Container fluid
  className=" position-fixed bottom-0 w-100 text-white fw-bold"
  style={{ padding: "2rem", backgroundColor: "#39BDF9" }}
>
  <div className="footer-content d-flex justify-content-between align-items-center flex-wrap text-center gap-3">
    <p className="mb-0">© 2023 MIMO Blog App. MIT Licenced.</p>
    
    <div className="d-flex gap-3">
      <a href="/terms" className="text-white text-decoration-none">Terms & Services</a>
      <a href="/privacy" className="text-white text-decoration-none">Privacy Policy</a>
    </div>
    
    <div className="d-flex gap-3 ">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebook size={20}  style={{ color: "white" }}/>
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter size={20}  style={{ color: "white" }}/>
      </a>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
        <FaGithub size={20}  style={{ color: "white" }}/>
      </a>
    </div>
  </div>
</Container>
  );
}

export default Footer;
