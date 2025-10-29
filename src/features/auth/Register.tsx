import React, { useEffect, useState } from 'react'
import logo from '../../assets/m-logo-design.svg';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../../types/auth';
import { useForm } from 'react-hook-form';
import {registers} from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
function Register() {
  const {user}=useAppSelector(state =>state.auth);
    const navigate = useNavigate();
   useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  const dispatch=useAppDispatch();

  const [showPassword,setShowPassword]=useState(false);
  const [showConfirmPassword,setShowConfirmPassword]=useState(false);

  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<RegisterFormData>({
        resolver:zodResolver(registerSchema) 
  });
  const onSubmit=(data:RegisterFormData)=>{
      dispatch(registers({userName:data.username,email:data.email,password:data.password,confirmPassword:data.confirmPassword}));
  };
  return (
    <div className="register-container">
      <div className="register-form">
        <img src={logo} alt="logo" width="48" height="48" className="d-block mx-auto mb-3" />
        <h2 className="text-center mb-2 fw-bold" style={{letterSpacing:"-2px"}}>Sign up to an account</h2>
        <p className="text-center" style={{color:"#92a6b0"}}>Already registered? <Link to="/login" className="login-here">Sign in</Link> to your account</p>
        <form onSubmit={handleSubmit(onSubmit)}>  

          <div className="form-group mb-2">
            <label htmlFor="username">Username</label>    
            <input type="text" className="form-control" id="username" {...register("username")} />
            {errors.username && <p className="text-danger mt-1">{errors.username.message}</p>}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="email">Email</label>    
            <input type="email" className="form-control" id="email" {...register("email")} />
            {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="password">Password</label>
            <div className="position-relative">
            <input type={showPassword ? "text" : "password"} className="form-control" id="password" {...register("password")} />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (<AiOutlineEyeInvisible size={20} style={{color:'#92a6b0'}}/>) : (<AiOutlineEye size={20} style={{color:'#92a6b0'}} />)}
              </button>
            </div>
            {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="position-relative">
            <input type={showConfirmPassword ? "text" : "password"} className="form-control" id="confirmPassword" {...register("confirmPassword")} />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (<AiOutlineEyeInvisible size={20} style={{color:'#92a6b0'}}/>) : (<AiOutlineEye size={20} style={{color:'#92a6b0'}} />)}
              </button>

              </div>
              {errors.confirmPassword && <p className="text-danger mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary register-btn mt-4 w-100" disabled={isSubmitting}>Sign Up</button>
        </form>

      </div>


    </div>
  )
}

export default Register