import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import logo from '../../assets/m-logo-design.svg';
import { Link } from 'react-router-dom';
function Login() {
  const [showPassword, setShowPassword] =useState(false);
  return (
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="logo" width="48" height="48" className="d-block mx-auto mb-3" />
        <h2 className="text-center mb-2 fw-bold" style={{letterSpacing:"-2px"}}>Sign in to your account</h2>
        <p className='text-center'>Don't have an account? <Link to="/Register" className="register-here">Register here</Link></p>
        <form>
          <div className="form-group mb-2">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="password">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Password"
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (<AiOutlineEyeInvisible size={20} style={{color:'#39BDF9'}}/>) : (<AiOutlineEye size={20} style={{color:'#39BDF9'}} />)}
              </button>
            </div>
            
          </div>
          <button type="submit" className="btn btn-primary login-btn mt-4 w-100">Sign In</button>
        </form>
      </div>
      </div>
  )
}

export default Login