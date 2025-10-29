import  { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import logo from '../../assets/m-logo-design.svg';
import { Link, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from './authSlice';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormData } from '../../types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
function Login() {
  const [showPassword, setShowPassword] =useState(false);
  const dispatch=useAppDispatch();
  const {user} =useAppSelector(state =>state.auth);
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<LoginFormData>({
        resolver:zodResolver(loginSchema) 
  });
  const onSubmit=(data:LoginFormData)=>{
      dispatch(login({email:data.email,password:data.password}));
  }
    if(user) return <Navigate to="/" />;
  return (
  
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="logo" width="48" height="48" className="d-block mx-auto mb-3" />
        <h2 className="text-center mb-2 fw-bold" style={{letterSpacing:"-2px"}}>Sign in to your account</h2>
        <p className='text-center' style={{color:"#92a6b0"}}>Don't have an account? <Link to="/Register" className="register-here">Register here</Link></p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-2">
            <label htmlFor="email">Email</label>    
            <input type="email" className="form-control" id="email"  {...register("email")}/>
            {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="password">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
       
                {...register("password")}
              />
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
          <button type="submit" className="btn btn-primary login-btn mt-4 w-100" disabled={isSubmitting}>Sign In</button>
        </form>
      </div>
      </div>
  )
}

export default Login