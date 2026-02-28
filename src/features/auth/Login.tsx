import  { useState } from 'react'
import logo from '../../assets/m-logo-design.svg';
import { Link, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from './authSlice';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormData } from '../../types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import PasswordToggleButton from '../../components/common/PasswordToggleButton';
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
        <img src={logo} alt="logo" width="48" height="48" loading="lazy"  className="d-block mx-auto mb-3" />
        <h2 className="text-center mb-2 fw-bold auth-heading">Sign in to your account</h2>
        <p className='text-center auth-subtitle'>Don't have an account? <Link to="/Register" className="register-here">Register here</Link></p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
              <PasswordToggleButton
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            </div>
             {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
             <div className="text-end mt-1">
              <Link to="/forgot-password" className="login-here auth-subtitle-small">Forgot password?</Link>
             </div>
          </div>
          <button type="submit" className="btn btn-primary login-btn mt-4 w-100" disabled={isSubmitting}>Sign In</button>
        </form>
      </div>
      </div>
  )
}

export default Login